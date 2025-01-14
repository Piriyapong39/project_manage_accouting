const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const XLSX = require("xlsx")
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
    async readXlsxFile(xlsxFile){
        try {

            const workbook = XLSX.read(xlsxFile[0].buffer, { type: 'buffer' })
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            return jsonData
        } catch (error) {
            throw error
        }
    }
    async generateExcel(data, accountingId) {
        try {
            const filePath = path.join(__dirname, `../upload/excel/`);
            const formattedData = data.map((item) => ({
                TransactionID: item.transaction_id,
                Note: item.note,
                TransactionType: item.transaction_type,
                TransactionSubType: item.transaction_sub_type,
                TransactionTypeName: item.transaction_type_name,
                Amount: item.amount,
                CreatedAt: item.created_at,
            }));
    
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
            const workbook = XLSX.utils.book_new();
            let sheetName = `transaction-${accountingId}`;
            if (sheetName.length > 31) {
                sheetName = sheetName.slice(0, 31); 
            }
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            const resolvedPath = path.join(filePath, `transactions-${accountingId}.xlsx`);
            XLSX.writeFile(workbook, resolvedPath);
    
            return resolvedPath
        } catch (error) {
            throw error
        }
    }
}
module.exports = ManageFiles