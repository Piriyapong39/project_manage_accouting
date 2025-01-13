// Dependecies
const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const app = express()
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

// config env
const PORT = config.get("PORT")

app.get("/", (req, res) => {
    return res.json({msg: "Hello world"})
})

// import route
const userRoute = require("./modules/user-modules/user-routes")
const accountingRoute = require("./modules/account-modules/account-route")
const transactionRoute = require("./modules/transaction-modules/transaction-route")
const summaryRoute = require("./modules/summary-modules/summary-route")


// all routes
app.use("/users", userRoute)
app.use("/accounting", accountingRoute)
app.use("/transaction", transactionRoute)
app.use("/summary", summaryRoute)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})