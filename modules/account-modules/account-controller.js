const Model = require("./account-model")

class Accounting extends Model {

    // declare variable
    #limit = 10

    constructor(){
        super();
    }
    async getAccounting(req){
        try {
            const userId = req.user.id
            const page = req.body.page
            if(!page){
                throw new Error("page is required")
            }
            return await this._getAccounting(userId, page, this.#limit)
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
            return await this._createAccounting(userId, bank_id, balance)
        } catch (error) {
            throw error
        }
    }
    async deleteAccounting(){
        try {
            
        } catch (error) {
            throw error
        }
    }

}

const accounting = new Accounting();
module.exports = accounting