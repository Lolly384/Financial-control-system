const db = require('../db');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const DB = new db();

module.exports = class {

    loginUser = async (req, res) => {
        try {
            // Получаем данные пользователя из тела запроса
            const { username, password } = req.body;
            console.log('Received login request with username:', username, 'and password:', password);
            // Вызываем метод loginUser из модуля DB, передавая ему данные пользователя
            const user = await DB.loginUser(username, password);
    
            // Отправляем успешный результат клиенту
            res.status(200).json(user);
        } catch (error) {
            console.error('Error during user login:', error);
            res.status(500).json({ message: 'Error during user login' });
        }
    }
    

    registrUser = async (req, res) => {
        try {
            // Получаем данные транзакции из тела запроса
            const { email, username, password } = req.body;

            // Вызываем метод addTransaction из вашего модуля DB, передавая ему данные транзакции
            const user = await DB.registrUser(email, username, password);

            // Отправляем успешный результат клиенту
            res.status(200).json(user);
        } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).json({ message: 'Error adding user' });
        }
    }
    


}