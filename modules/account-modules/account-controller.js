const Model = require("./account-model")

class Accounting extends Model {
    constructor(){
        super();
    }
    async getAccounting(req){
        try {
            const userId = req.user.id
            return await this._getAccounting(userId)
        } catch (error) {
            throw error
        }
    }

    async createAccounting(req){
        try {
            const userId = req.user.id
            const { bank_id, balance } = req.body
            if(!bank_id){
                throw new Error("you are missing bank id")
            }
            return await this.__createAccounting(userId, bank_id, balance)
        } catch (error) {
            throw error
        }
    }

}

const accounting = new Accounting();
module.exports = accounting