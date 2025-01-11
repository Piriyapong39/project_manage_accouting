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
            if(Number(transaction_type) !== 1 && Number(transaction_type) !== 2 && Number(transaction_type) !== "number"){
                throw new Error("error in transaction_type field")
            }
            if(Number(transaction_type) === 1){
                if(Number(transaction_sub_type) < 1 || Number(transaction_sub_type) > 5){
                    throw new Error("transaction sub type in transaction_type 1 is between 1-5")
                }
                if(Number(amount) < 0 && Number(amount) !== "number"){
                    throw new Error("income must more than 0 or amount must be number")
                }   
            }
            if(Number(transaction_type) === 2){
                if(Number(transaction_sub_type) < 1 || Number(transaction_sub_type) > 8){
                    throw new Error("transaction sub type in transaction_type 2 is between 1-8")
                }
                if(Number(amount) > 0 && Number(amount) !== "number"){
                    throw new Error("expense must less than 0 or amount must be number")
                }   
            }
            const newNote = detectProfanityService.censorBadWords(note)
            const transactionForm = {
                transaction_id,
                newNote,
                transaction_type: Number(transaction_type),
                transaction_sub_type: Number(transaction_sub_type),
                amount: Number(amount),
                transaction_image
            }
            return await this._createTransaction(transactionForm)
        } catch (error) {
            throw error
        }
    }
}

const transaction = new Transaction();
module.exports = transaction