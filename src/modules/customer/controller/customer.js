import customerModel from "../../../../DB/model/Customer.model.js";
import ApiFeatures from "../../../utils/apiFeatures.js";
import { asyncHandler } from "../../../utils/errorHandling.js";



export const test = (req, res, next) => {
    return res.json({ message: "hi" })
}

//get customer
export const customerProfiles = asyncHandler(async (req, res, next) => {

    const apiFeature = new ApiFeatures(customerModel.find(/* { isDeleted: false } */), req.query).paginate().filter().sort().search().select()
    const customer = await apiFeature.mongooseQuery

    return res.status(200).json({ message: "Done", customer })
})




//create customer
export const createCustomer = asyncHandler(async (req, res, next) => {
    const { name, phone, address, description, status } = req.body
    if (await customerModel.findOne({ name })) {
        return next(new Error("Duplicated Name", { cause: 404 }))
    }

    if (req.body.money && (!req.body.status || req.body.status === 'صافي')) {
        return next(new Error(`Error: Error can't be صافي when fined money`, { status: 409 }));
    }

    if (req.body.money == 0 && (!req.body.status || req.body.status === "عليه فلوس" || req.body.status === 'ليه فلوس')) {
        return next(new Error(`Error: Error can't be عليه فلوس or ليه فلوس when not fined money`, { status: 409 }));
    }

    const customer = await customerModel.create(req.body)
    return res.json({ message: "Done", customer });
})


/* transactions: [{
        amount: {
            type: Number,
            required: true,
            min: [0, "Amount cannot be negative"]
        },
        date: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: ["تحويل", "كاش"],
            required: true
        },
        description: {
            type: String,
            default: "No description"
        },
        clarification: { //df3 wla 5d 7agat 3notaa
            type: String,
            enum: ["دفع", "دين"],
            required: true
        }
    }], */


//update customer and create transaction
export const updateCustomer = asyncHandler(async (req, res, next) => {
    const { name, phone, address, description, status, money, lastTransaction } = req.body
    const { customerId } = req.params
    const customer = await customerModel.findById(customerId)
    if (!customer) {
        return next(new Error("not found", { cause: 404 }))
    }
    // Update customer fields if provided
    if (name) customer.name = name;
    if (phone) customer.phone = phone; // You might want to handle phone updates more carefully
    if (address) customer.address = address;
    if (description) customer.description = description;
    if (status) customer.status = status;
    // Allow money to be updated directly
    if (money !== undefined) {
        customer.money = money;

        // Update the status based on the new money value
        if (customer.money === 0) {
            customer.status = "صافي"; // "Clear"
        } /* else {
            customer.status = "عليه فلوس" || "ليه فلوس"; // "Has money owed"
        } */
    }
    // Handle the last transaction if provided
    if (lastTransaction && lastTransaction.amount) {
        const { amount, type, description, clarification } = lastTransaction;

        // Update the customer's money based on the transaction type
        if (clarification === "دفع") { // "Payment"
            customer.money -= amount;
            customer.status = customer.money === 0 ? "صافي" : " "; // "Clear" or "Owes money"
        } else if (clarification === "دين") { // "Debt"
            customer.money += amount;
            /* customer.status = "عليه فلوس";  */// "Owes money"
        }

        customer.transactions.push({
            amount,
            date: new Date(),
            type,
            description,
            clarification
        });

    }
    await customer.save() /* = await customerModel.findByIdAndUpdate(customerId, req.body, { new: true }) */
    return res.json({ message: "Done", customer });
})

//delete customer
export const deleteCustomer = asyncHandler(async (req, res, next) => {
    const { customerId } = req.params
    const customer = await customerModel.findByIdAndUpdate(customerId, { isDeleted: true }, { new: true })
    return res.json({ message: "Done", customer });
})


// Create Customer Transactions
export const createCustomerTransactions = asyncHandler(async (req, res, next) => {
    const { customerId } = req.params;
    const { amount, type, description, clarification } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
        return next(new Error("Invalid amount", { cause: 400 }));
    }
    if (!["دفع", "دين"].includes(clarification)) {
        return next(new Error("Invalid clarification type", { cause: 400 }));
    }


    // Find the customer by ID
    const customer = await customerModel.findById(customerId);
    if (!customer) {
        return next(new Error("Customer not found", { cause: 404 }));
    }

    // Update the customer's money based on the transaction type
    if (customer.status === "عليه فلوس") { // "Owes money"
        if (clarification === "دين") {
            customer.money += Number(amount);
            customer.status = "عليه فلوس"; // Still owes money
        } else if (clarification === "دفع") {
            customer.money -= Number(amount);
            // Update status based on the new value of money
            if (customer.money < 0) {
                customer.status = "ليه فلوس"; // "Has money"
            } else if (customer.money === 0) {
                customer.status = "صافي"; // "Clear"
            } else {
                customer.status = "عليه فلوس"; // Still owes money
            }
        }
    } else if (customer.status === "ليه فلوس") { // "Has money"
        if (clarification === "دين") {
            customer.money -= Number(amount);
            // Update status based on the new value of money
            if (customer.money < 0) {
                customer.status = "عليه فلوس"; // "Owes money"
            } else if (customer.money === 0) {
                customer.status = "صافي"; // "Clear"
            } else {
                customer.status = "ليه فلوس"; // Still has money
            }
        } else if (clarification === "دفع") {
            customer.money += Number(amount);
            customer.status = "ليه فلوس"; // Still has money
        }
    } else if (customer.status === "صافي") {
        if (clarification === "دين") {
            customer.money += Number(amount);
            customer.status = "عليه فلوس";
        }
        else if (clarification === "دفع") {
            customer.money -= Number(amount);
            customer.status = "ليه فلوس";
        }
    }

    // Ensure money is always non-negative
    customer.money = Math.abs(customer.money);

    customer.transactions.push({
        amount,
        date: new Date(),
        type,
        description,
        clarification,
    });

    await customer.save()

    return res.json({ message: "Done", customer });

});

// Update Customer Transactions
export const updateCustomerTransactions = asyncHandler(async (req, res, next) => {
    const { customerId, transactionId } = req.params;
    const { amount, type, description, clarification } = req.body;

    // Find the customer by ID
    const customer = await customerModel.findById(customerId);
    if (!customer) {
        return next(new Error("Customer not found", { cause: 404 }));
    }

    // Find the transaction by ID
    const transaction = customer.transactions.id(transactionId);
    if (!transaction) {
        return next(new Error("Transaction not found", { cause: 404 }));
    }

    // Store the old amount and clarification for calculations
    const oldAmount = transaction.amount;
    const oldClarification = transaction.clarification;

    // Update customer money based on the transaction clarification
    if (amount !== undefined) {
        // If the old clarification was "دفع" (Payment)
        if (oldClarification === "دفع") {
            customer.money += oldAmount; // Restore previous amount
            customer.money -= amount; // Deduct new amount
        }
        // If the old clarification was "دين" (Debt)
        else if (oldClarification === "دين") {
            customer.money -= oldAmount; // Restore previous amount
            customer.money += amount; // Add new amount
        }

        // Update the transaction amount
        transaction.amount = amount;
    }



    if (clarification !== undefined) {
        // Adjust the customer's money based on the change in clarification
        if (oldClarification === "دفع" && clarification === "دين") {
            // Switching from "Payment" to "Debt"
            customer.money += oldAmount; // Restore the previous payment amount
        } else if (oldClarification === "دين" && clarification === "دفع") {
            // Switching from "Debt" to "Payment"
            customer.money -= oldAmount; // Remove the previous debt amount
        }
        transaction.clarification = clarification; // Update the clarification
    }

    // Update customer money based on transaction clarification
    /*   if (amount !== undefined && clarification!== undefined) {
          if (transaction.clarification === "دفع") { // "Payment"
              const oldMoney = customer.money += transaction.amount;
              if (clarification === "دفع") {
                  customer.money = oldMoney - amount;
                  customer.status = customer.money === 0 ? "صافي" : "عليه فلوس"; // "Clear" or "Owes money"
              } else {
                  customer.money = oldMoney + amount;
                  customer.status = "عليه فلوس";
              }
  
          } else if (transaction.clarification === "دين") { // "Debt"
              const oldMoney = customer.money -= transaction.amount;
              if (clarification === "دفع") {
                  customer.money = oldMoney + amount;
                  customer.status = "عليه فلوس"; // "Owes money"
              } else {
                  customer.money = oldMoney - amount;
                  customer.status = customer.money === 0 ? "صافي" : "عليه فلوس"; // "Clear" or "Owes money"
              }
          }
          transaction.amount = amount;
          transaction.clarification = clarification;
      } */
    // Update the transaction fields if provided

    if (type) transaction.type = type;
    if (description) transaction.description = description;


    // Save the updated customer document
    await customer.save();

    // Return the updated transaction
    return res.json({ message: "Done", customer });
});


// Delete Customer Transactions`
export const deleteCustomerTransactions = asyncHandler(async (req, res, next) => {
    const { customerId, transactionId } = req.params;

    // Find the customer by ID
    const customer = await customerModel.findById(customerId);
    if (!customer) {
        return next(new Error("Customer not found", { cause: 404 }));
    }

    // Find the index of the transaction by ID
    const transactionIndex = customer.transactions.findIndex(transaction => transaction._id.toString() === transactionId);
    if (transactionIndex === -1) {
        return next(new Error("Transaction not found", { cause: 404 }));
    }

    // Determine the transaction details to restore the balance
    /* const transactionToDelete = customer.transactions[transactionIndex];
    if (transactionToDelete.clarification === "دفع") { // "Payment"
        customer.money += transactionToDelete.amount; // Restore the money
    } else if (transactionToDelete.clarification === "دين") { // "Debt"
        customer.money -= transactionToDelete.amount; // Reduce the money
    } */

    // Remove the transaction from the customer's transaction history
    customer.transactions.splice(transactionIndex, 1);

    // Save the updated customer document
    await customer.save();

    // Return a success message with updated customer data
    return res.json({ message: "Done", customer });
});