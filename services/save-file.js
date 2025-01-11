const fs = require("fs")


class SaveFiles {
    constructor(){}
    saveTransactionImg(transactionForm){
        try {  
            console.log(transactionForm.transaction_image.length)
            if(transactionForm.transaction_image.length > 1){
                return "only 1 transaction slip "
            }
            console.log(transactionForm)
        } catch (error) {
            console.log(error.message)
        }
    }
}

module.exports = SaveFiles