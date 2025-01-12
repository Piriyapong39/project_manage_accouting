// import database
const { sequelize, QueryTypes} = require("../../config/database")

// import services
const ManageFiles = require("../../services/manage-file")
const manageFiles = new ManageFiles();

class Model {
    #limit = 30
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
    async _getTransactionData(responseData){
        try {
            const { userId, page, filters } = responseData
            const {
                startTime,
                endTime,
                date,
                month,
                year,
                bank_id,
                transaction_type,
            } = filters
            // condition =
            const results = await sequelize.query(

                `
                    SELECT 
                        tt.transaction_id,
                        tt.note,
                        tt.transaction_type,
                        tt.transaction_sub_type,
                        ttype.transaction_type_name,
                        tt.amount,
                        tt.accounting_id,
                        tt.created_at,
                        ta.bank_id,
                        ta.balance,
                        tb.bank_name
                    FROM tb_transactions tt
                    INNER JOIN tb_accounting ta ON tt.accounting_id = ta.id
                    INNER JOIN tb_bank tb ON ta.bank_id = tb.id
                    INNER JOIN tb_transaction_type ttype ON (tt.transaction_type = ttype.transaction_type AND tt.transaction_sub_type = ttype.transaction_sub_type)
                    WHERE 1=1
                        -- AND created_at BETWEEN '2025-01-12 10:00' AND '2025-01-12 12:00'
                        AND tt.accounting_id = 17
                    ORDER BY created_at DESC
                    LIMIT 10 OFFSET 0;
                `
            )
            return responseData
        } catch (error) {
            throw error
        }
    }
}

module.exports = Model