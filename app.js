const express = require('express')
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const productRouter = require('./routes/products')
const app = express()
require('dotenv').config()
require("express-async-errors")

const Port = process.env.PORT || 3000;

// app.use(notFound);
app.use(errorHandlerMiddleware);
app.use(express.json())

app.use("/api/v1/products",productRouter);
// app.get("/api/v1", (req, res) => {
//   res.status(200).json({ msg: "sent" });
// });

const start =async()=>{
    try {
        connectDB(process.env.MONG0_URI);
       app.listen(Port, () => {
         console.log(`port ${Port} is active`);
       }); 
    } catch (error) {
        console.log(error);
    }
}

start()
