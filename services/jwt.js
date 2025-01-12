// dependecies
const jwt = require("jsonwebtoken")
const config = require("config")

// env
const JWT_SECRET_KEY = config.get("JWT_SECRET_KEY")

class JwtService {
    constructor(){}
    generateToken(userData){
        try {
            const token = jwt.sign(
                {
                    id: Number(userData.id),
                    email: userData.email,
                    first_name: userData.first_name,
                    last_name: userData.last_name
                }, 
                JWT_SECRET_KEY, 
                { 
                    expiresIn: 60 * 60 * 6
                }
            );
            return token
        } catch (error) {
            throw error
        }
    }
    decodedToken(token){
        try {
            if(!token){
                throw new Error("token is missing")
            }
            const tokenSplit = token.split(" ")
            if(tokenSplit[0] !== "Bearer"){
                throw new Error("invalid token format")
            }
            var decoded = jwt.verify(tokenSplit[1], JWT_SECRET_KEY);
            return decoded
        } catch (error) {
            throw error
        }
    }
}

const jwtService = new JwtService()
module.exports = jwtService