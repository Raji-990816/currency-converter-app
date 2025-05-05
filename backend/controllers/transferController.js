const Transfer = require('../models/transferModel');
const mongoose = require('mongoose');
const axios = require('axios');

//get all transfers
const getTransfers = async (req, res) => {
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
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

//create a transfer
const createTransfer = async (req, res) => {

    const { from, to, amount } = req.body;
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const { data } = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`);
    const rate = data.conversion_rates[to];
    const convertedAmount = (amount * rate).toFixed(3);

    try {
        const createTransfer = new Transfer({ from, to, amount, convertedAmount, rate });
        await createTransfer.save();
        res.status(200).json(createTransfer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//delete a transfer
const deleteTransfer = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No transfer with that id');
    }

    const deleteTransfer = await Transfer.findByIdAndDelete({_id: id});
    
    if(!deleteTransfer) {
        return res.status(404).send('No transfer with that id');
    }
        res.status(200).json({ message: 'Transfer revoked!' });
};

module.exports = { getTransfers, createTransfer, deleteTransfer };