const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
class ManageFiles {
    constructor(){}
    async saveTransactionImg(transactionForm){
        try {
            if(transactionForm.transaction_image.length > 1){
                return {error: "you can import only 1 transaction image"}
            }
            const extName = path.extname(transactionForm.transaction_image[0].originalname).toLowerCase();
            const fileName = uuidv4() + extName;
            const filePath = path.join(__dirname, `../upload/picture/transaction-slip/${transactionForm.transaction_type}/${transactionForm.transaction_sub_type}`, fileName);
            if(extName !== ".png" && extName !== ".jpeg" && extName !== ".jpg"){
                return {error: "Only png, jpeg and jpg is allow"}
            }
            // write picture file
            await fs.promises.writeFile(filePath, transactionForm.transaction_image[0].buffer);
            return {picPath: filePath};
        } catch (error) {
            return {error: error.message}
        }
    }

    async removeFile(path){
        try {
            let result = "remove file successfully"
            fs.rm(path, {recursive: true}, (error) => { 
                if(error){ 
                    result = error.message
                } 
            }) 
            return result
        } catch (error) {
            console.log(error.message)
        }
    }
}

module.exports = ManageFiles