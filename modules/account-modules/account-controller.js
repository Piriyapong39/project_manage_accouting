const Model = require("./account-model")

class Accounting extends Model {

    // declare variable
    #limit = 10

    constructor(){
        super();
    }
    async createAccounting(req){
        try {
            const userId = req.user.id
            const { bank_id } = req.body
            let { balance } = req.body
            balance = balance || 0;
            if(balance < 0){
                throw new Error("balance must more than 0")
            }
            if(!bank_id){
                throw new Error("you are missing bank id")
            }
            return await this._createAccounting(userId, bank_id, balance)
        } catch (error) {
            throw error
        }
    }
    async deleteAccounting(req){
        try {
            const userId = req.user.id
            const { accounting_id } = req.body
            if(!accounting_id){
                throw new Error("accounting id is required")
            }
            return await this._deleteAccounting(userId, accounting_id)
        } catch (error) {
            throw error
        }
    }

}

const accounting = new Accounting();
module.exports = accounting