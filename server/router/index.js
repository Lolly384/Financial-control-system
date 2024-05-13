const express = require('express');
const router = express.Router();

const TransactionsClass = require("../controllers/transactions");
const {getTransactions, addTransaction, deleteTransaction} =  new TransactionsClass();

const TaskClass = require("../controllers/task");
const {getTask, addTask} =  new TaskClass();

router.get('/test', (req, res) => {
    res.status(200).json({ success: "true1" })
});


router.get("/getTransactions", getTransactions)
router.post("/addTransaction", addTransaction)
router.delete("/deleteTransaction/:id", deleteTransaction);

router.get("/getTask", getTask)
router.post("/addTask", addTask)

module.exports = router;