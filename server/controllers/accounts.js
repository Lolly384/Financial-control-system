const db = require('../db');
const DB = new db();
const jwt = require('jsonwebtoken');
module.exports = class {

    getAccounts = async (req, res) => {
        try {
            const accounts = await DB.getAccounts();
            res.status(200).json(accounts);
        } catch (error) {
            console.error('Error fetching accounts:', error);
            res.status(500).json({ message: 'Error fetching accounts' });
        }
    }

    addAccount = async (req, res) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Получаем токен из заголовка запроса
            if (!token) {
                throw new Error('Токен отсутствует');
            }

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here'); // Декодируем токен
            const { username } = decodedToken; // Получаем имя пользователя из декодированного токена

            const { name, balance } = req.body;
            const newAccount = await DB.addAccount(name, balance, username);
            res.status(200).json(newAccount);
        } catch (error) {
            console.error('Error adding account:', error);
            res.status(500).json({ message: 'Error adding account' });
        }
    }

    updateAccountBalance = async (req, res) => {
        try {
            const { accountName, newBalance } = req.body;
    
            // Обновляем баланс счёта
            const account = await DB.updateAccountBalance(accountName, newBalance);
            res.status(200).json(account);
        } catch (error) {
            console.error('Error updating account balance:', error);
            res.status(500).json({ message: 'Error updating account balance' });
        }
    };

}
