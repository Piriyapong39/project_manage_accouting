const { sequelize, QueryTypes} = require("../../config/database")
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
    async _deleteAccounting(userId, accounting_id){
        try {
            const result = await sequelize.query(
                `
                    DELETE 
                    FROM tb_accounting
                    WHERE 1=1
                        AND user_id = :userId
                        AND id = :accounting_id
                `,
                {
                    replacements: {
                        userId,
                        accounting_id
                    },
                    type: QueryTypes.BULKDELETE
                }
            )
            if(result === 0){
                throw new Error("accounting id is not found")
            }
            return "delete accounting successfully"
        } catch (error) {
            throw error
        }
    }
}

module.exports = Model