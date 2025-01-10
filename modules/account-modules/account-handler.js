// dependencies
const express = require("express")
const Router = express.Router();

// import accounting 
const accounting = require("./account-controller")

// endpoint
Router.get("/get-accounting-data", async(req, res) => {
    try {
        return res.status(200).json({data: await accounting.getAccounting(req)})
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})
Router.post("/create-accounting", async(req, res) => {
    try {
        return res.status(200).json({data: await accounting.getAccounting(req)})
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})






module.exports = Router