// import database
const { sequelize, QueryTypes} = require("../../config/database")

// import services
const SaveFiles = require("../../services/save-file")
const saveFiles = new SaveFiles();

class Model {
    constructor(){}
    async _createTransaction(transactionForm){
        try {
            const transactionPicPath = saveFiles.saveTransactionImg(transactionForm)
            return transactionPicPath
        } catch (error) {
            throw error
        }
    }
}

module.exports = Model