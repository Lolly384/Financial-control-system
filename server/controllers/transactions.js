const db = require('../db');
const DB = new db();
const jwt = require('jsonwebtoken');

module.exports = class {
    getTransactions = async (req, res) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Получаем токен из заголовка запроса
            if (!token) {
                throw new Error('Токен отсутствует');
            }

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here'); // Декодируем токен
            const { username } = decodedToken; // Получаем имя пользователя из декодированного токена

            // Выполняем запрос к базе данных для получения транзакций пользователя
            const transactions = await DB.getTransactions(username);
            res.status(200).json(transactions);
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            res.status(500).json({ error: 'Ошибка при выполнении запроса' });
        }
    }

    getTransactionsCurrentMonth = async (req, res) => {
        try {
            const currentDate = new Date(); // Получаем текущую дату
            const currentYear = currentDate.getFullYear(); // Получаем текущий год
            const currentMonth = currentDate.getMonth() + 1; // Получаем текущий месяц
            const startDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`; // Формируем начальную дату месяца
            const lastDay = new Date(currentYear, currentMonth, 0).getDate(); // Получаем последний день месяца
            const endDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDay}`; // Формируем конечную дату месяца


            const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Получаем токен из заголовка запроса
            if (!token) {
                throw new Error('Токен отсутствует');
            }

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here'); // Декодируем токен
            const { username } = decodedToken; // Получаем имя пользователя из декодированного токена

            // Выполняем запрос к базе данных для получения транзакций пользователя за текущий месяц текущего года
            const transactions = await DB.getTransactionsCurrentMonth(username, startDate, endDate);
            res.status(200).json(transactions);
        } catch (error) {
            console.error('Ошибка при выполнении запроса controller:', error);
            res.status(500).json({ error: 'Ошибка при выполнении запроса controller' });
        }
    }

    getTransactionsDate = async (req, res) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Получаем токен из заголовка запроса
            if (!token) {
                throw new Error('Токен отсутствует');
            }
    
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here'); // Декодируем токен
            const { username } = decodedToken; // Получаем имя пользователя из декодированного токена
    
            if (!username || !req.query.startDate || !req.query.endDate) {
                throw new Error('Отсутствуют обязательные параметры запроса');
            }
    
            const { startDate, endDate } = req.query; // Получаем данные транзакции из параметров строки запроса
    
            console.log('Received dates:', startDate, endDate); // Логируем полученные даты
    
            // Выполняем запрос к базе данных для получения транзакций пользователя за указанный период
            const transactions = await DB.getTransactionsDate(username, startDate, endDate);
            res.status(200).json(transactions);
        } catch (error) {
            console.error('Ошибка при выполнении запроса controller:', error);
            res.status(500).json({ error: 'Ошибка при выполнении запроса controller' });
        }
    }
    


    addTransaction = async (req, res) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                throw new Error('Токен отсутствует');
            }

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here');
            const { username } = decodedToken;
            // Получаем данные транзакции из тела запроса
            const { type, sum, date, category, description, recipient, sender, status, accounts } = req.body;

            // Парсим дату из клиента в формат Date()
            const dateParts = date.split('-');
            const formattedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // -1 потому что в JavaScript месяцы начинаются с 0

            // Вызываем метод addTransaction из вашего модуля DB, передавая ему данные транзакции
            const transaction = await DB.addTransaction(type, sum, formattedDate, category, description, recipient, sender, status, accounts, username);

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
    }

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