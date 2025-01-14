const { sequelize, QueryTypes} = require("../../config/database")

// import service 
const FindDate = require("../../services/days-in-moth")
const findDate = new FindDate();
const convertTime = require("../../services/convert-time-zone")
class Model {

    #limit = 10
    #limitTransaction = 50
    totalDays = findDate.getDaysInMonth(new Date())
    dateNow = new Date().getDate()

    constructor(){}
    async _getAccountingData(userId, page, accountingId){
        try {
            const offset = (page - 1) * this.#limit; 

            let condition = ""

            if(accountingId){
                condition += `AND ta.id = :accountingId`
            }
            
            const results = await sequelize.query(
                `
                SELECT
                    ta.id,
                    ta.bank_id,
                    tb.bank_name,
                    ta.balance
                FROM tb_accounting ta
                INNER JOIN tb_bank tb ON ta.bank_id = tb.id
                WHERE 1=1 
                    AND user_id = :userId
                    ${condition}
                ORDER BY updated_at DESC
                LIMIT :limit OFFSET :offset
                `,
                {
                    replacements: {
                        userId,
                        limit: this.#limit,
                        offset,
                        accountingId
                    },
                    type: QueryTypes.SELECT
                }
            )

            const resultsBalance = await sequelize.query(
                `
                SELECT balance
                FROM tb_accounting
                WHERE user_id = :userId
                `,
                {
                    replacements: {
                        userId
                    },
                    type: QueryTypes.SELECT
                }
            )

            const totalBalance = resultsBalance.reduce((acc, { balance }) => acc + parseFloat(balance), 0);
            const averageSpendPerDay = parseFloat((totalBalance / (this.totalDays - this.dateNow)).toFixed(2))

            const countAccounting = results.length

            const responseData = {
                totalBalance,
                averageSpendPerDay,
                countAccounting,
                accounting: results,

            }
            return responseData
        } catch (error) {
            throw error
        }
    }
    async _getTransactionData(page, accountingId, filters) {
        try {
            const offset = (page - 1) * this.#limitTransaction;
            let condition = "";
            const replacementData = { accountingId };
    
            if (filters.transaction_id) {
                condition += `AND tt.transaction_id = :transaction_id\n`;
                replacementData.transaction_id = filters.transaction_id;
            }
    
            if (filters.date) {
                const dateComponents = filters.date.split('-');
                if (dateComponents.length === 1) {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = today.getMonth() + 1; 
                    const day = parseInt(filters.date);
                    condition += `AND EXTRACT(YEAR FROM tt.created_at) = :year
                                AND EXTRACT(MONTH FROM tt.created_at) = :month
                                AND EXTRACT(DAY FROM tt.created_at) = :day\n`;
                    replacementData.year = year;
                    replacementData.month = month;
                    replacementData.day = day;
                } else {
                    const dateObj = new Date(filters.date);
                    const formattedDate = dateObj.toISOString().split('T')[0];
                    condition += `AND DATE(tt.created_at) = DATE(:date)\n`;
                    replacementData.date = formattedDate;
                }
            }  

            if(filters.month && filters.year){
                condition += `AND EXTRACT(MONTH FROM tt.created_at) = :month 
                             AND EXTRACT(YEAR FROM tt.created_at) = :year\n`;
                replacementData.month = parseInt(filters.month);
                replacementData.year = parseInt(filters.year);
            }  

            if(filters.year){
                condition += `AND EXTRACT(YEAR FROM tt.created_at) = :year\n`
                replacementData.year = parseInt(filters.year)
            }

            if (filters.startTime) {
                let endTime = filters.endTime || new Date().toISOString().split('T')[0] + ' 23:59:59';
                condition += `AND tt.created_at BETWEEN :startTime AND :endTime\n`;
                replacementData.startTime = filters.startTime;
                replacementData.endTime = endTime;
            }
    
            if (filters.bank_id) {
                condition += `AND tt.bank_id = :bank_id\n`;
                replacementData.bank_id = filters.bank_id;
            }
    
            if (filters.transaction_type) {
                condition += `AND tt.transaction_type = :transaction_type\n`;
                replacementData.transaction_type = filters.transaction_type;
    
                if (filters.transaction_sub_type) {
                    condition += `AND tt.transaction_sub_type = :transaction_sub_type\n`;
                    replacementData.transaction_sub_type = filters.transaction_sub_type;
                }
            }
            const query = `
                SELECT 
                    tt.transaction_id,
                    tt.note,
                    tt.transaction_type,
                    tt.transaction_sub_type,
                    ttype.transaction_type_name,
                    tt.created_at,
                    tt.amount,
                    tt.transaction_slip_path
                FROM tb_transactions tt
                INNER JOIN tb_transaction_type ttype ON (
                    tt.transaction_type = ttype.transaction_type 
                    AND tt.transaction_sub_type = ttype.transaction_sub_type
                )
                WHERE 1=1
                    AND tt.accounting_id = :accountingId
                    ${condition}
                ORDER BY tt.created_at DESC
                LIMIT ${this.#limitTransaction}
                OFFSET ${offset}
            `;


            const results = await sequelize.query(query, {
                replacements: replacementData,
                type: QueryTypes.SELECT
            });

            for(const result of results){
                result.created_at = convertTime.convertToThaiTime(result.created_at)  
            }
       
            

            const incomeTransaction = results
                .filter(e => e.transaction_type == 1) 
                .reduce((acc, { amount }) => acc + parseFloat(amount), 0); 
            
            const expenseTransaction = results
                .filter(e => e.transaction_type == 2)
                .reduce((acc, { amount }) => acc + parseFloat(amount), 0)
            const totalSummary = incomeTransaction + expenseTransaction
            
            const responseData = {
                incomeTransaction,
                expenseTransaction,
                totalSummary,
                countTransaction: results.length,
                results
            }
            return responseData;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Model