require("dotenv").config()
const express = require('express')
const rootRouter = require("./routes/v1/index")
const app = express()

app.use(express.json())
app.use("/v1", rootRouter)


const PORT = process.env.PORT | 3000

app.listen(PORT, () => {
    console.log(`Sever is running on ${PORT}`)
})