const Transfer = require('../models/transferModel');
const mongoose = require('mongoose');
const axios = require('axios');

//get all transfers
const getTransfers = async (req, res, next) => {
    try{
        //Parse `page` and `limit` from query parameters, with defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        //Calculate how many documents to skip
        const skip = (page - 1)*limit;

        //fetch needed fields, paginated
        const transfers = await Transfer.find()
            .skip(skip)
            .limit(limit)
            .select('from to amount convertedAmount rate createdAt')
            .sort({createdAt: -1});

        //count total documents
        const total = await Transfer.countDocuments();

        //return paginated response
        res.status(200).json({
            success: true,
            page,
            totalPages:Math.ceil(total/limit),
            totalItems: total,
            items: transfers
        });
    }catch(error){
        next(error);
    }
};

//create a transfer
const createTransfer = async (req, res, next) => {
    try {
        const { from, to, amount } = req.body;

        if (!from || !to || !amount || amount <= 0) {
            const error = new Error("Invalid input: please provide valid 'from', 'to', and 'amount'.");
            error.status = 400;
            throw error;
        }

        const apiKey = process.env.EXCHANGE_RATE_API_KEY;
        const { data } = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`);

        if (!data.conversion_rates[to]) {
            const error = new Error("Currency not supported or invalid.");
            error.status = 400;
            throw error;
        }

        const rate = data.conversion_rates[to];
        const convertedAmount = (amount * rate).toFixed(3);

        const createTransfer = new Transfer({ from, to, amount, convertedAmount, rate });
        await createTransfer.save();

        res.status(200).json(createTransfer);
    } catch (error) {
        next(error);
    }
};

//delete a transfer
const deleteTransfer = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error("Invalid transfer ID.");
            error.status = 400;
            throw error;
        }

        const deleteTransfer = await Transfer.findByIdAndDelete({ _id: id });

        if (!deleteTransfer) {
            const error = new Error("No transfer found with that ID.");
            error.status = 404;
            throw error;
        }

        res.status(200).json({ message: 'Transfer revoked!' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getTransfers, createTransfer, deleteTransfer };