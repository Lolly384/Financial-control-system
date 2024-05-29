const express = require('express');
const router = express.Router();

const TransactionsClass = require("../controllers/transactions");
const { getTransactions, getTransactionsCurrentMonth, getTransactionsProgress, getTransactionsDate, addTransaction, deleteTransaction, changeTransaction } = new TransactionsClass();

const TaskClass = require("../controllers/task");
const { getTask, addTask, deleteTask, changeTask } = new TaskClass();

const UserClass = require("../controllers/user");
const { registrUser, loginUser } = new UserClass();

const AccountsClass = require("../controllers/accounts");
const { getAccounts, addAccount, updateAccountBalance, deleteAccount } = new AccountsClass();

router.get('/test', (req, res) => {
    res.status(200).json({ success: "true1" })
});


router.get("/getTransactions", getTransactions)
router.get("/getTransactionsCurrentMonth", getTransactionsCurrentMonth)
router.get("/getTransactionsDate", getTransactionsDate)
router.post("/getTransactionsProgress", getTransactionsProgress)
router.post("/addTransaction", addTransaction)
router.post("/deleteTransaction", deleteTransaction)
router.post("/changeTransaction", changeTransaction)



router.get("/getTask", getTask)
router.post("/addTask", addTask)
router.post("/deleteTask", deleteTask)
router.post("/changeTask", changeTask)

router.post("/login", loginUser)
router.post("/register", registrUser)

router.get('/getAccounts', getAccounts)
router.post('/addAccount', addAccount)
router.post('/updateAccountBalance', updateAccountBalance)
router.post('/deleteAccount', deleteAccount)

module.exports = router;