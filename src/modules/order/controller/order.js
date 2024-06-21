import productModel from "../../../../DB/model/Product.model.js" // add 5asm
import { asyncHandler } from "../../../utils/errorHandling.js"
import orderModel from "../../../../DB/model/Order.model.js"
import titleModel from "../../../../DB/model/Title.model.js";
import subcategoryModel from "../../../../DB/model/Subcategory.model.js";
import { paginate } from "../../../utils/paginate.js"
import ApiFeatures from "../../../utils/apiFeatures.js"
import customerModel from "../../../../DB/model/Customer.model.js";

//getOrder
export const getOrders = asyncHandler(async (req, res, next) => {
    /*   const x = order[1].createdAt
      console.log(`${x.getDate()}/${x.getMonth()+1}/${x.getFullYear()}`); */
    const apiFeature = new ApiFeatures(orderModel.find(/* { isDeleted: false } */), req.query).paginate().filter().sort().search().select()
    const order = await apiFeature.mongooseQuery

  /*   await orderModel.updateOne({ _id: orderId }, { status: 'delivered', updatedBy: req.user._id })
    */ return res.status(201).json({ message: 'Done', order })
})


//createOrder
export const createOrder = asyncHandler(async (req, res, next) => {
    const { products, note, paid, customerId, status, profitMargin } = req.body; // add 5asm + al madfo3

    const now = new Date();

    const hours = now.getHours();
    const time = `${hours > 12 ? hours - 12 : hours} : ${now.getMinutes()} ${hours >= 12 ? 'PM' : 'AM'}`;
    const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

    if (customerId) {
        if (!await customerModel.findById(customerId)) {
            return next(new Error("In-valid customer Id", { cause: 400 }))
        }
    }

    const productsIds = []
    const finalProductsList = []
    let finalPrice = 0;
    for (const product of products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
            isDeleted: false
        })

        if (!checkProduct) {
            return next(new Error(`In-valid product ${product.productId}`, { cause: 400 }))
        }

        productsIds.push(product.productId)
        product.name = checkProduct.name;

        /* const checkTitle = await titleModel.findById({ _id: checkProduct.titleId })
        if (checkTitle.name == "سيور") {
            const subcategory = await subcategoryModel.findById({ _id: checkProduct.subcategoryId })
            const inch = await checkProduct.name.split("*")
            product.unitPrice = Math.ceil((product?.inchPrice || subcategory.details.inchPrice) * parseInt(inch[0]))
            product.finalPrice = Math.ceil((product?.inchPrice || subcategory.details.inchPrice) * parseInt(inch[0])) * product.quantity;
        } else {

            product.unitPrice = checkProduct.finalPrice - (product?.discount || 0)
            product.finalPrice = (checkProduct.finalPrice - (product?.discount || 0)) * product.quantity;
        }
 */
        /*      product.unitPrice = checkProduct.price
                product.finalPrice = (checkProduct.price) * product.quantity; */

        product.unitPrice = checkProduct.finalPrice - (product?.discount || 0)
        product.finalPrice = (checkProduct.finalPrice - (product?.discount || 0)) * product.quantity;

        finalProductsList.push(product);
        finalPrice += product.finalPrice;
    }

    const order = await orderModel.create({
        date,
        time,
        userId: req.user._id,
        customerId,
        note,
        products: finalProductsList,
        finalPrice,
        paid: req.body?.paid || finalPrice,
        status,
        profitMargin
    })

    for (const product of products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } })
    }

    return res.status(201).json({ message: 'Done', order })
})


///updateOrder 
export const updateOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const { products, note, date, time, paid, customerId, status } = req.body;

    const order = await orderModel.findById({ _id: orderId })
    if (!order) {
        return next(new Error(`In-valid order`, { cause: 400 }))
    }
    if (customerId) {
        if (!await customerModel.findById(customerId)) {
            return next(new Error("In-valid customer Id", { cause: 400 }))
        }
        order.customerId = customerId
    }

    const productsIds = []
    const finalProductsList = []
    let finalPrice = 0;
    if (products) {

        for (const product of products) {

            const checkProduct = await productModel.findOne({
                _id: product.productId,
                stock: { $gte: product.quantity },
                isDeleted: false
            })

            if (!checkProduct) {
                return next(new Error(`In-valid product ${product.productId}`, { cause: 400 }))
            }

            const oldProduct = await order.products.find(pro => pro.productId == product.productId);
            if (oldProduct) {
                await productModel.updateOne({ _id: product.productId }
                    , { $inc: { stock: parseInt(oldProduct.quantity) } })
                product.quantity = (parseInt(product?.quantity) || oldProduct.quantity)
                product.inchPrice = (product?.inchPrice || oldProduct.inchPrice)
                product.discount = (product?.discount || oldProduct.discount)
                order.products = order.products.filter((e, i) => e !== oldProduct)

            }

            productsIds.push(product.productId)
            product.name = checkProduct.name;

            /*   const checkTitle = await titleModel.findById({ _id: checkProduct.titleId })
              if (checkTitle.name == "سيور") {
                  const subcategory = await subcategoryModel.findById({ _id: checkProduct.subcategoryId })
                  const inch = await checkProduct.name.split("*")
                  product.unitPrice = Math.ceil((product?.inchPrice || subcategory.details.inchPrice) * parseInt(inch[0]))
                  product.finalPrice = Math.ceil((product?.inchPrice || subcategory.details.inchPrice) * parseInt(inch[0])) * product.quantity;
              } else {} */

            product.unitPrice = checkProduct.finalPrice - (product?.discount || 0)
            product.finalPrice = (checkProduct.finalPrice - (product?.discount || 0)) * product.quantity;


            order.products.push(product)
        }

    }

    note ? order.note = note : order.note
    status ? order.status = status : order.status
    date ? order.date = date : order.date
    time ? order.time = time : order.time
    paid ? order.paid = paid : order.paid


    //price
    order.products.map((e, i) => finalPrice += e.finalPrice)
    order.finalPrice = finalPrice
    order.paid = req.body?.paid || finalPrice

    await order.save()

    for (const product of products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } })
    }
    return res.status(201).json({ message: 'Done', order })
})

///cancelOrder
export const cancelOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const order = await orderModel.findById({ _id: orderId })
    if (!order) {
        return next(new Error(`In-valid order`, { cause: 400 }))
    }
    await orderModel.updateOne({ _id: orderId, userId: req.user._id }, { status: 'رفض', updatedBy: req.user._id })
    for (const product of order.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: parseInt(product.quantity) } })
    }

    return res.status(201).json({ message: 'Done', order })
})


