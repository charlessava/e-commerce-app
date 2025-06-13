const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv").config()
const jwt = require("jsonwebtoken")
const cors = require("cors")
const routes = require("./Routes")


const app = express()
app.use(express.json())
app.use(cors())




port = process.env.PORT || 5000
mongoDB_url = process.env.MONGODB_URL



mongoose.connect(mongoDB_url)
    .then(
        console.log("Data base connected successfully"),
        app.listen(port, () => {
            console.log(`server started and running on port ${port}`)
        })

    ).catch((error) => {
        console.error((error))
    })

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome to your one choice e-commerce App 'FRESH MART' " })

})




app.use("/api", routes)









