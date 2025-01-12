// import database
const { sequelize, QueryTypes} = require("../../config/database")

// import services
const ManageFiles = require("../../services/manage-file")
const manageFiles = new ManageFiles();

class Model {
    constructor(){}
    async _createTransaction(transactionForm){
        try {
            let transactionPicPath = await manageFiles.saveTransactionImg(transactionForm)
            const slipPath = transactionPicPath?.picPath || null;
            await sequelize.query(
                `
                INSERT INTO tb_transactions (
                    transaction_id,
                    note,
                    transaction_type,
                    transaction_sub_type,
                    accounting_id,
                    amount,
                    created_at,
                    transaction_slip_path
                ) VALUES (
                    :transaction_id,
                    :newNote,
                    :transaction_type,
                    :transaction_sub_type,
                    :accounting_id,
                    :amount,
                    now(),
                    :slipPath
                )            
                `,{
                    replacements: {
                        transaction_id: transactionForm.transaction_id,
                        newNote: transactionForm.newNote,
                        transaction_type: transactionForm.transaction_type,
                        transaction_sub_type: transactionForm.transaction_sub_type,
                        accounting_id: transactionForm.accounting_id,
                        amount: transactionForm.amount,
                        slipPath: slipPath
                    },
                    type: QueryTypes.RAW
                }
            )
            let slipMessage = transactionPicPath.error || (slipPath ? "Slip saved successfully" : "No slip provided");    
            return {
                message: "Created transaction successfully",
                slipStatus: slipMessage
            }
        } catch (error) {
            throw error
        }
    }
    async _deleteTransaction(transactionId) {
        try {
            const response = {
                transactionStatus: "",
                slipStatus: ""
            };
            const result = await sequelize.query(
                `
                DELETE FROM tb_transactions 
                WHERE transaction_id = :transactionId 
                RETURNING transaction_id, transaction_slip_path
                `,
                {
                    replacements: { transactionId },
                    type: QueryTypes.SELECT
                }
            );
            if (result.length === 0) {
                response.transactionStatus = "not found transaction to delete";
                response.slipStatus = "transaction slip is not found";
                return response;
            }
            response.slipStatus = result[0].transaction_slip_path === null 
                ? "transaction slip is not found"
                : await manageFiles.removeFile(result[0].transaction_slip_path);
    
            response.transactionStatus = "delete transaction successfully";
            
            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Model