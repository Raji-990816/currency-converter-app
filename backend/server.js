require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const transfersRouter = require('./routers/transferRouters');
const errorHandler = require('./middleware/errorMiddleware');

//express app
const app = express();

//middleware
app.use(cors());
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//routes
app.use('/transfers',transfersRouter);

//error handler
app.use(errorHandler);


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

