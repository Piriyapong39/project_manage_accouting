// import database
const { sequelize, QueryTypes} = require("../../config/database")

// import method deleteTransaction
const transaction = require("../transaction-modules/transaction-controller")
class Model {
    constructor(){}

    async _getAccounting(userId, page, limit) {
        try {
            const offset = (page - 1) * limit; 
            const results = await sequelize.query(
                `
                    SELECT 
                        a.id,
                        a.bank_id,
                        a.balance,
                        b.bank_name
                    FROM tb_accounting a
                    INNER JOIN tb_bank b ON a.bank_id = b.id
                    WHERE 1=1
                        AND user_id = :userId
                    ORDER BY a.id ASC
                    LIMIT :limit OFFSET :offset
                `,
                {
                    replacements: {
                        userId,
                        limit,
                        offset
                    },
                    type: QueryTypes.SELECT
                }
            );
            return results
        } catch (error) {
            throw error;
        }
    }
    async _createAccounting(userId, bank_id, balance){
        try {

            await sequelize.query(
                `
                    INSERT INTO tb_accounting (bank_id, user_id, balance)
                    VALUES (:bank_id, :userId, :balance)
                `,
                {
                    replacements: {
                        bank_id, userId, balance
                    },
                    type: QueryTypes.INSERT
                }
            )
            return "create accounting successfully"
        } catch (error) {
            throw error
        }
    }
    async _deleteAccounting(userId, accounting_id) {
        try {
            const transactions = await sequelize.query(
                `
                SELECT transaction_id
                FROM tb_transactions
                WHERE accounting_id = :accounting_id;
                `,
                {
                    replacements: { accounting_id },
                    type: QueryTypes.SELECT
                }
            )
            console.log(transactions)
            if (transactions.length === 0) {
                throw new Error("No transactions found for the specified accounting ID");
            }
    
            const transactionIds = transactions.map(transaction => transaction.transaction_id);
            console.log(transactionIds)
    
            for (const transactionId of transactionIds) {
                await transaction._deleteTransaction(transactionId)
            }
    
            const results = await sequelize.query(
                `
                DELETE FROM tb_accounting
                WHERE user_id = :userId
                AND id = :accounting_id
                RETURNING id;
                `,
                {
                    replacements: { userId, accounting_id },
                    type: QueryTypes.SELECT
                }
            );
    
            if (results.length === 0) {
                throw new Error("Accounting ID is not found");
            }
    
            console.log(results);
            return "Delete accounting and its transactions successfully";
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = Model