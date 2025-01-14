// dependencies
const express = require("express")
const Router = express.Router()
const fs = require("fs");
const path = require("path");

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
Router.post("/upload-transaction", upload, async(req, res) => {
    try {
        return res.status(201).json({message: await transaction.uploadTransaction(req) })
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})
Router.get("/export-transaction", async (req, res) => {
    try {
        const filePath = await transaction.exportTransaction(req);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
        }
        return res.download(filePath, path.basename(filePath), (error) => {
            if (error) {
                return res.status(400).json({ error: error.message });
            } else {
                try {
                    fs.unlinkSync(filePath);
                } catch (deleteErr) {
                    null
                }
            }
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});




/*
Router.get("/get-data/:page", async (req, res) => {
    try {
        return res.status(200).json(await transaction.getTransactionData(req));
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
*/

module.exports = Router