// dependencies
const express = require("express")
const Router = express.Router();

// import accounting 
const accounting = require("./account-controller")

// endpoint
Router.post("/create-accounting", async(req, res) => {
    try {
        return res.status(200).json({message: await accounting.createAccounting(req)})
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})
Router.delete("/delete-accounting", async(req, res) => {
    try {
        return res.status(200).json({message: await accounting.deleteAccounting(req)})
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})


module.exports = Router