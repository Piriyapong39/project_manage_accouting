const { sequelize, QueryTypes} = require("../../config/database")
class Model {
    constructor(){}

    async _getAccounting(userId){
        try {
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
                `,
                {
                    replacements: {
                        userId
                    },
                    type: QueryTypes.SELECT
                }
            )
            return results
        } catch (error) {
            throw error
        }
    }
    async _createAccounting(){
        try {
            
        } catch (error) {
            throw error
        }
    }
}

module.exports = Model