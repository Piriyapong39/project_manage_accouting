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
const manageAccountRoute = require("./modules/account-modules/account-route")

// all route
app.use("/users", userRoute)
app.use("/accounting", manageAccountRoute)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})