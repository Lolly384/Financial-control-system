const express = require('express');
const router = express.Router();

const TransactionsClass = require("../controllers/transactions");
const {getTransactions, addTransaction, deleteTransaction, changeTransaction} =  new TransactionsClass();

const TaskClass = require("../controllers/task");
const {getTask, addTask, deleteTask, changeTask} =  new TaskClass();

router.get('/test', (req, res) => {
    res.status(200).json({ success: "true1" })
});


router.get("/getTransactions", getTransactions)
router.post("/addTransaction", addTransaction)
router.post("/deleteTransaction", deleteTransaction);
router.post("/changeTransaction", changeTransaction);

router.get("/getTask", getTask)
router.post("/addTask", addTask)
router.post("/deleteTask", deleteTask)
router.post("/changeTask", changeTask)

module.exports = router;