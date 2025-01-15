// import database
const { sequelize, QueryTypes} = require("../../config/database")

// import services
const ManageFiles = require("../../services/manage-file")
const manageFiles = new ManageFiles();
const convertTime = require("../../services/convert-time-zone")

class Model {
    constructor(){}
    async _createTransaction(transactionForm){
        try {
            console.log(transactionForm)
            // if transaction type is expense => check balance in tb_accounting first
            const lastestBalacne = await sequelize.query(
                `
                    SELECT
                        balance
                    FROM tb_accounting
                    WHERE id = :accounting_id
                `,
                {
                    replacements: {
                        accounting_id: transactionForm.accounting_id
                    },
                    type: QueryTypes.SELECT
                }
            )
            if(transactionForm.transaction_type === 2){
                if((Number(lastestBalacne[0].balance) + transactionForm.amount) < 0){
                    throw new Error("expense is more than balance")
                }
            }

            // create transaction and slip
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

            // update balance in tb_accounting
            const totalBalance = Number(lastestBalacne[0].balance) + transactionForm.amount
            await sequelize.query(
                `
                    UPDATE tb_accounting
                    SET 
                        balance = :totalBalance,
                        updated_at = now()
                    WHERE id = :acoounting_id
                `,{
                    replacements: {
                        totalBalance,
                        acoounting_id: transactionForm.accounting_id
                    },
                    type: QueryTypes.UPDATE
                }
            )
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
    async _exportTransaction(accountingId) {
        if (!accountingId) {
            throw new Error("accounting ID is required");
        }
    
        try {
            const results = await sequelize.query(
                `
                SELECT 
                    tt.transaction_id,
                    tt.note,
                    tt.transaction_type,
                    tt.transaction_sub_type,
                    ttype.transaction_type_name,
                    tt.amount,
                    tt.created_at
                FROM tb_transactions tt 
                INNER JOIN tb_transaction_type ttype ON (
                    tt.transaction_type = ttype.transaction_type 
                    AND tt.transaction_sub_type = ttype.transaction_sub_type
                )
                WHERE tt.accounting_id = :accountingId
                ORDER BY tt.created_at DESC
                `,
                {
                    replacements: { accountingId },
                    type: QueryTypes.SELECT
                }
            );
    
            if (results.length === 0) {
                throw new Error("transaction is not found");
            }
    
            try {
                for (const result of results) {
                    result.created_at = convertTime.convertToThaiTime(result.created_at);
                }
    
                const path = await manageFiles.generateExcel(results, accountingId);
                return path;
            } catch (error) {
                throw new Error(error);
            }
        } catch (error) {
            throw error;
        }
    }


    /*
    async _getTransactionData(responseData) {
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
                transaction_sub_type,
                accounting_id
            } = filters

            const offset = (page - 1) * this.#limit

            let conditions = []
            let params = []
    
            conditions.push('ta.user_id = ?')
            params.push(userId)
    
            if(accounting_id){
                conditions.push('tt.accounting_id = ?')
                params.push(accounting_id)
            }
            if (startTime && endTime) {
                conditions.push('tt.created_at BETWEEN ? AND ?')
                params.push(startTime, endTime)
            }
    
            if (date) {
                conditions.push('DATE(tt.created_at) = ?')
                params.push(date)
            }
    
            if (month && year) {
                conditions.push('EXTRACT(MONTH FROM tt.created_at) = ? AND EXTRACT(YEAR FROM tt.created_at) = ?')
                params.push(month, year)
            }
    
            if (bank_id) {
                conditions.push('ta.bank_id = ?')
                params.push(bank_id)
            }
    
            if (transaction_type) {
                conditions.push('tt.transaction_type = ?')
                params.push(transaction_type)
            }
    
            if (transaction_sub_type) {
                conditions.push('tt.transaction_sub_type = ?')
                params.push(transaction_sub_type)
            }
    
            const query = `
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
                    tb.bank_name,
                    ta.balance
                FROM tb_transactions tt
                INNER JOIN tb_accounting ta ON tt.accounting_id = ta.id
                INNER JOIN tb_bank tb ON ta.bank_id = tb.id
                INNER JOIN tb_transaction_type ttype ON (tt.transaction_type = ttype.transaction_type 
                    AND tt.transaction_sub_type = ttype.transaction_sub_type)
                WHERE ${conditions.join(' AND ')}
                ORDER BY tt.created_at DESC
                LIMIT ? OFFSET ?
            `
            params.push(this.#limit, offset)
    
            // console.log(conditions)
            // console.log(params)
            const results = await sequelize.query(query, {
                replacements: params,
                type: sequelize.QueryTypes.SELECT
            })
            console.log(results)
            return {
                results
            }
        } catch (error) {
            throw error
        }
    }
    */
}

module.exports = Model