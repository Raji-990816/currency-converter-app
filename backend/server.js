require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const transfersRouter = require('./routers/transferRouters');

//express app
const app = express();

//middleware
app.use(cors());  // Enable CORS (important for frontend-backend communication)
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies 

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