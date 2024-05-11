const express = require('express');
const router = express.Router();

const TransactionsClass = require("../controllers/transactions");
const {getTransactions, addTransaction} =  new TransactionsClass();

router.get('/test', (req, res) => {
    res.status(200).json({ success: "true1" })
});


router.get("/getTransactions", getTransactions)

router.post("/addTransaction", addTransaction)


module.exports = router;