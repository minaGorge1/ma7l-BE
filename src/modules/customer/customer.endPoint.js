import { roles } from "../../middleware/auth.js";



export const endpoint = {
    watch: [roles.User, roles.Admin],
    create: [roles.Admin],
    update: [roles.Admin],
    delete: [roles.Admin]
}