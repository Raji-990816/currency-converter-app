const express = require('express');
const { createTransfer, getTransfers, deleteTransfer } = require('../controllers/transferController');
const router = express.Router();

//get all transfers
router.get('/', getTransfers);

//create a transfer
router.post('/', createTransfer);

//delete a transfer
router.delete('/:id', deleteTransfer);

module.exports = router;