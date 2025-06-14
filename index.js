const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const cors = require("cors")
const routes = require("./Routes")


const app = express()
app.use(express.json())
app.use(cors())
app.use("/api", routes)



const port = process.env.PORT || 5000
const mongoDB_url = process.env.MONGODB_URL



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














