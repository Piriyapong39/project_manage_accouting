// dependencies
const { v4: uuidv4 } = require('uuid');

// import model
const Model = require("./transaction-model")

// import services
const detectProfanityService = require("../../services/detect-profanity")
const ManageFiles = require("../../services/manage-file")
const manageFiles = new ManageFiles();

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
    async uploadTransaction(req){
        try {
            const accountingId = Number(req.body.accounting_id)
            const files = req.files

            if(!accountingId){
                throw new Error("accounting id is required")
            }

            if (!files || files.length !== 1) {
                throw new Error("can upload only 1 file")
            }

            const namePart = files[0].originalname.split(".")
            const extName = namePart[namePart.length - 1]

            if(extName !== "xlsx"){
                throw new Error("only xlsx file is allowed")
            }

            const results = await manageFiles.readXlsxFile(files)
            // console.log(results)

            for(const result of results){

                const transaction_type = Number(result.transaction_type)
                const transaction_sub_type = Number(result.transaction_sub_type)
                const amount = Number(result.amount)

                if(!result.note || !result.transaction_type || !result.transaction_sub_type || !result.amount){
                    throw new Error("You are missing some fields")
                }
                if(transaction_type != 1 && transaction_type != 2){
                    throw new Error("transaction type must be 1 or 2")
                }

                if(transaction_type == 1){
                    if(transaction_sub_type < 1 || transaction_sub_type > 5){
                        throw new Error("transaction_sub_type in tranasction_type 1 must be between 1-5")
                    }
                    if(amount < 0){
                        throw new Error("income must more than 0")
                    }
                }
                if(transaction_type == 2){
                    if(transaction_sub_type < 1 || transaction_sub_type > 8){
                        throw new Error("transaction_sub_type in tranasction_type 2 must be between 1-8")
                    }
                    if(amount > 0){
                        throw new Error("expense must less than 0")
                    }
                }

                result.accounting_id = accountingId
                result.newNote = detectProfanityService.censorBadWords(result.note)
                result.transaction_id = uuidv4();

                await this._createTransaction(result)
            }     

            return "insert data successfully"
        } catch (error) {
            throw error
        }
    }
    async exportTransaction(req){
        try {
            const accountingId = req.body.accounting_id
            if(!accountingId){
                throw new Error("accounting id is required")
            }
            return await this._exportTransaction(accountingId)
        } catch (error) {
            throw error
        }
    }


/*
    async getTransactionData(req) {
        try {
            const userId = req.user.id
            const page = req.params.page;
            if (!page) {
                throw new Error("page is required")
            }
            const { 
                startTime, 
                endTime, 
                date, 
                month, 
                year, 
                bank_id, 
                transaction_type, 
                transaction_sub_type,
                accounting_id
            } = req.query
            const responseData = {
                userId,
                page: Number(page),
                filters: {
                    startTime: startTime || null,
                    endTime: endTime || null,
                    date: date || null,
                    month: month || null,
                    year: year || null,
                    bank_id: bank_id || null,
                    transaction_type: transaction_type || null,
                    transaction_sub_type: transaction_sub_type || null,
                    accounting_id: accounting_id || null
                },
            }
            return await this._getTransactionData(responseData)
        } catch (error) {
            throw error
        }
    }
*/
}

const transaction = new Transaction();
module.exports = transaction