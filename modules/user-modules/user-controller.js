const Model = require("./user-model");

class User extends Model {
    constructor() {
        super();
    }

    async userRegister(req) {
        try {
            const { email, password, first_name, last_name } = req.body;
            if (!email || !password || !first_name || !last_name) {
                throw new Error("You are missing some fields. Please check again.");
            }
            // check email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error("Invalid email format.");
            }
            // check length password
            if (password.length <= 6) {
                throw new Error("Password must be at least 6 characters long.");
            }
            return await this._userRegister(email, password, first_name, last_name)
        } catch (error) {
            throw error;
        }
    }

    async userLogin(req){
        try {
            const { email, password } = req.body
            if(!email || !password){
                throw new Error("email and password are required")
            }
            // check email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error("Invalid email format.");
            }
            // check length password
            if (password.length < 6) {
                throw new Error("Password must be at least 6 characters long.");
            }
            return await this._userLogin(email, password)
        } catch (error) {
            throw error
        }
    }
}

module.exports = User;
