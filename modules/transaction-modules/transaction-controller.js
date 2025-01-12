// dependencies
const { v4: uuidv4 } = require('uuid');

// import model
const Model = require("./transaction-model")

// import services
const detectProfanityService = require("../../services/detect-profanity")

class Transaction extends Model {
    constructor(){
        super()
    }
    async createTransaction(req){
        try {
            const transaction_image = req.files
            const transaction_id = uuidv4();
            const { note, transaction_type, transaction_sub_type, accounting_id, amount } = req.body 
            if(!transaction_type || !transaction_sub_type || !accounting_id || !amount){
                throw new Error("you are missing some fields")
            }
            const numTransactionType = Number(transaction_type)
            if(numTransactionType !== 1 && numTransactionType !== 2) {
                throw new Error("error in transaction_type field")
            }
            const numAmount = Number(amount)
            const numSubType = Number(transaction_sub_type)
            if(isNaN(numAmount)) {
                throw new Error("amount must be a number")
            }
        
            if(numTransactionType === 1){
                if(numSubType < 1 || numSubType > 5){
                    throw new Error("transaction sub type in transaction_type 1 is between 1-5")
                }
                if(numAmount <= 0){
                    throw new Error("income must be more than 0")
                }   
            }
        
            if(numTransactionType === 2){
                if(numSubType < 1 || numSubType > 8){
                    throw new Error("transaction sub type in transaction_type 2 is between 1-8")
                }
                if(numAmount >= 0){
                    throw new Error("expense must be less than 0")
                }   
            }
            const newNote = detectProfanityService.censorBadWords(note)
            const transactionForm = {
                transaction_id,
                newNote,
                transaction_type: numTransactionType,
                transaction_sub_type: numSubType,
                accounting_id: Number(accounting_id),
                amount: numAmount,
                transaction_image
            }      
            return await this._createTransaction(transactionForm)
        } catch (error) {
            throw error
        }
    }
    async deleteTransaction(req){
        try {
            const transactionId = req.body.transaction_id
            if(!transactionId){
                throw new Error("transaction id is required")
            }
            return await this._deleteTransaction(transactionId)
        } catch (error) {
            throw error
        }
    }
}

const transaction = new Transaction();
module.exports = transaction