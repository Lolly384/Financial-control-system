const db = require('../db');
const DB = new db();
const jwt = require('jsonwebtoken');
module.exports = class {
    getTask = async (req, res) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Получаем токен из заголовка запроса
            if (!token) {
                throw new Error('Токен отсутствует');
            }

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here'); // Декодируем токен
            const { username } = decodedToken; // Получаем имя пользователя из декодированного токена

            const task = await DB.getTask(username);
            console.log(task)
            res.status(200).json(task)
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            res.status(500).json({ error: 'Ошибка при выполнении запроса' });
        }
    }

    addTask = async (req, res) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                throw new Error('Токен отсутствует');
            }

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here');
            const { username } = decodedToken;

            const { name, description, requirements, additionalreq } = req.body;

            const task = await DB.addTask(name, description, requirements, additionalreq, username,);

            res.status(200).json(task);
        } catch (error) {
            console.error('Error adding task:', error);
            res.status(500).json({ message: 'Error adding task' });
        }
    };

    deleteTask = async (req, res) => {
        try {
            const { id } = req.body;
            const task = await DB.deleteTask(id);

            res.status(200).json(task);
        } catch (error) {
            console.error('Ошибка при удалении транзакции:', error);
            res.status(500).json({ message: 'Ошибка при удалении транзакции', });
        }
    }

    changeTask = async (req, res) => {
        try {
            const { id, name, description, requirements, additionalreq } = req.body;
            const rowCount = await DB.changeTask(id, name, description, requirements, additionalreq);

            if (rowCount === null) {
                return res.status(404).json({ message: 'Задача с указанным id не найдена', });
            }

            res.status(200).json({ message: 'Задача успешно изменена', rowCount });
        } catch (error) {
            console.error('Ошибка при изменении задачи:', error);
            res.status(500).json({ message: 'Ошибка при изменении задачи' });
        }
    }


}