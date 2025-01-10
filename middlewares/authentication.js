// import service
const jwtService = require("../services/jwt")

const authentication = (req, res, next) => {
    try {
        const token = req.headers.authorization
        const userData = jwtService.decodedToken(token)
        req.user = userData
        next();
    } catch (error) {
        return res.status(401).json({error: error.message})
    }
}

module.exports = authentication