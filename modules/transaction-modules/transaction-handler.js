// dependencies
const express = require("express")
const Router = express.Router()

// import middlewares
const upload = require("../../middlewares/upload")

// import transaction instance
const transaction = require("./transaction-controller")

Router.post("/create-transaction", upload, async(req, res) => {
    try {
        return res.status(201).json({message: await transaction.createTransaction(req)})
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})
Router.delete("/delete-transaction", async(req, res) => {
    try {
        return res.status(200).json({message: await transaction.deleteTransaction(req)})
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})
Router.get("/get-data/:page", async (req, res) => {
    try {
        return res.status(200).json(await transaction.getTransactionData(req));
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = Router