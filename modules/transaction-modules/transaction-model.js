// import database
const { sequelize, QueryTypes} = require("../../config/database")

class Model {
    constructor(){}
    async _createTransaction(transactionForm){
        try {
            console.log(transactionForm)
        } catch (error) {
            throw error
        }
    }
}

module.exports = Model