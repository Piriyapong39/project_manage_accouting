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
                        b.bank_name,
                        COUNT(*) OVER() as total_count
                    FROM tb_accounting a
                    INNER JOIN tb_bank b ON a.bank_id = b.id
                    WHERE 1=1
                        AND user_id = :userId
                    ORDER BY a.id DESC
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
            balance = balance || 0;
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
            console.log(result)
        } catch (error) {
            throw error
        }
    }
}

module.exports = Model