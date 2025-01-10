// dependencies
const { sequelize, QueryTypes } = require("../../config/database")
const config = require("config")
const bcrypt = require('bcrypt');

// import services
const jwt = require("../../services/jwt")

// import env
const saltRound = config.get("saltRound")

class Model {
    constructor(){}
    async _userRegister(email, password, first_name, last_name){
        try {
            const existEmail = await sequelize.query(
                `
                    SELECT email
                    FROM tb_users
                    WHERE 1=1
                        AND email = :email
                `,
                {
                    replacements: {
                        email
                    },
                    type: QueryTypes.SELECT
                }
            )
            if(existEmail.length !== 0){
                throw new Error("this email already exist")
            }
            const hashPassword = bcrypt.hashSync(password, saltRound)
            await sequelize.query(
                `
                    INSERT INTO tb_users (email, password, first_name, last_name)
                    VALUES (:email, :hashPassword, :first_name, :last_name)
                `,
                {
                    replacements: {
                        email,
                        hashPassword,
                        first_name,
                        last_name
                    }
                }
            )
            return "create user successfully"
        } catch (error) {
            throw error   
        }
    }
    async _userLogin(email, password){
        try {
            const result = await sequelize.query(
                `
                    SELECT 
                        id,
                        email, 
                        password,
                        first_name,
                        last_name
                    FROM tb_users
                    WHERE 1=1
                        AND email = :email
                `,
                {
                    replacements: {
                        email
                    },
                    type: QueryTypes.SELECT
                }
            )
            if(result.length === 0){
                throw new Error("wrong email, please try again")
            }
            if(bcrypt.compareSync(password, result[0].password) === false){
                throw new Error("wrong password, please try again")
            }
            const token = jwt.generateToken(result[0])
            return token
        } catch (error) {
            throw error
        }
    }
}

module.exports = Model