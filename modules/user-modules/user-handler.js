// Dependencies
const express = require("express")
const Router = express.Router();

// import validation
const User = require("./user-controller")
const userInstance = new User();

// import middlewares
const authentication = require("../../middlewares/authentication")

// endpoint
Router.post("/register", async(req, res) => {
    try {
        return res.status(201).json({message: await userInstance.userRegister(req)})
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})
Router.post("/login", async(req, res) => {
    try {
        return res.status(200).json({token: await userInstance.userLogin(req)})
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})
Router.post("/authentication", authentication, (req, res) => {
    try {
        const user = req.user
        return res.status(200).json({user})
    } catch (error) {
        return res.status(401).json({error: error.message})
    }
})
module.exports = Router


