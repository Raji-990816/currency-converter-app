const Transfer = require('../models/transferModel');
const mongoose = require('mongoose');
const axios = require('axios');

//get all transfers
const getTransfers = async (req, res) => {
    const getTransfers = await Transfer.find({}).sort({ createdAt: -1 });
    res.status(200).json(getTransfers);
};

//create a transfer
const createTransfer = async (req, res) => {

    const { from, to, amount } = req.body;
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const { data } = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`);
    const rate = data.conversion_rates[to];
    const convertedAmount = amount * rate;

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