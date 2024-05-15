const db = require('../db');
const DB = new db();

module.exports = class {
    getTransactions = async (req, res) => {
        const transactions = await DB.getTransactions();
        console.log(transactions)
        res.status(200).json(transactions)
    }

    addTransaction = async (req, res) => {
        try {
            // Получаем данные транзакции из тела запроса
            const { type, sum, date, category, description, recipient, sender, status, accounts } = req.body;

            // Парсим дату из клиента в формат Date()
            const dateParts = date.split('-');
            const formattedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // -1 потому что в JavaScript месяцы начинаются с 0

            // Вызываем метод addTransaction из вашего модуля DB, передавая ему данные транзакции
            const transaction = await DB.addTransaction(type, sum, formattedDate, category, description, recipient, sender, status, accounts);

            // Отправляем успешный результат клиенту
            res.status(200).json(transaction);
        } catch (error) {
            console.error('Error adding transaction:', error);
            res.status(500).json({ message: 'Error adding transaction' });
        }
    }

    deleteTransaction = async (req, res) => {

        try {
            const { transaction_id } = req.body;
            console.log(transaction_id);
            const transaction = await DB.deleteTransaction(transaction_id);

            res.status(200).json(transaction);
        } catch (error) {
            console.error('Ошибка при удалении транзакции:', error);
            res.status(500).json({ message: 'Ошибка при удалении транзакции', });
        }
    };

    changeTransaction = async (req, res) => {
        try {
            // Получаем данные транзакции из тела запроса
            const { transaction_id, type, sum, date, category, description, recipient, sender, status, accounts } = req.body;
    
            // Парсим дату из клиента в формат Date()
            const dateParts = date.split('-');
            const formattedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // -1 потому что в JavaScript месяцы начинаются с 0
    
            // Вызываем метод changeTransaction из вашего модуля DB, передавая ему данные транзакции
            const transaction = await DB.changeTransaction(transaction_id, type, sum, formattedDate, category, description, recipient, sender, status, accounts);
    
            // Отправляем успешный результат клиенту
            res.status(200).json(transaction);
        } catch (error) {
            console.error('Error changing transaction:', error);
            res.status(500).json({ message: 'Error changing transaction' });
        }
    }
    
}