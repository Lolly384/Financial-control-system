const db = require('../db');
const DB = new db();
const jwt = require('jsonwebtoken');

module.exports = class {

    getAccounts = async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Токен отсутствует' });
            }
    
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Токен отсутствует' });
            }
    
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here');
            const { username } = decodedToken;
    
            const accounts = await DB.getAccounts(username);
            res.status(200).json(accounts);
        } catch (error) {
            console.error('Error fetching accounts:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Некорректный токен' });
            }
            res.status(500).json({ message: 'Ошибка при выполнении запроса' });
        }
    };

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

    deleteAccount = async (req, res) => {
        try {
            const { id } = req.body;
            const task = await DB.deleteAccount(id);

            res.status(200).json(task);
        } catch (error) {
            console.error('Ошибка при удалении Счёта:', error);
            res.status(500).json({ message: 'Ошибка при удалении Счёта', });
        }
    }

    updateAccountBalance = async (req, res) => {
        try {
            const { id, newBalance } = req.body;
            console.log('Received data:', { id, newBalance });

            if (!id || newBalance == null) {
                console.log('Validation failed');
                return res.status(400).json({ message: 'id and newBalance are required' });
            }

            console.log('Updating account balance...');
            const account = await DB.updateAccountBalance(id, newBalance);
            console.log('Account updated:', account);
            res.status(200).json(account);
        } catch (error) {
            console.error('Error updating account balance controller:', error);
            res.status(500).json({ message: 'Error updating account balance controller' });
        }
    };

}
