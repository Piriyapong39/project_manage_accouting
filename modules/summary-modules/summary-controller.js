const Model = require("./summary-model")

class Summary extends Model {
    constructor(){
        super()
    }
    async getAccountingData(req){
        try {
            const userId = req.user.id
            const page = req.params.page
            const accountingId = req.query.accounting_id || null
            return await this._getAccountingData(userId, page, accountingId)
        } catch (error) {
            throw error
        }
    }
    async getTransactionData(req){
        try {

            const page = req.params.page
            const accountingId = req.body.accounting_id

            const {
                transaction_id,
                startTime, 
                endTime, 
                date, 
                month, 
                year, 
                bank_id, 
                transaction_type, 
                transaction_sub_type
            } = req.query

            const filters = {
                transaction_id: transaction_id || null,
                startTime: startTime || null,
                endTime: endTime || null,
                date: date || null,
                month: month || null,
                year: year || null,
                bank_id: bank_id || null,
                transaction_type: transaction_type || null,
                transaction_sub_type: transaction_sub_type || null
            }

            if(!accountingId){
                throw new Error("accounting id is required");
            }

            return await this._getTransactionData(page, accountingId, filters)
        } catch (error) {
            throw error
        }
    }
}

const sumary = new Summary()
module.exports = sumary