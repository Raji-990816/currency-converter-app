require('dotenv').config();
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const transfersRouter = require('./routers/transferRouters');

//express app
const app = express();

//middleware
app.use(compression());
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//routes
app.use('/transfers',transfersRouter);

//connect to mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connected to mongodb');
    })
    .catch((error) => {
        console.log(error);
    });

//listen for requests
app.listen(process.env.PORT, () => {
    console.log('listening on port ' + process.env.PORT);
});