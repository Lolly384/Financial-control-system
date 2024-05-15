const db = require('../db');
const DB = new db();

module.exports = class {
    getTask = async (req, res) => {
        const task = await DB.getTask();
        console.log(task)
        res.status(200).json(task)
    }

    addTask = async (req, res) => {
        try {
            // Получаем данные транзакции из тела запроса
            const { name, description, requirements, additionalreq } = req.body;

            // Вызываем метод addTransaction из вашего модуля DB, передавая ему данные транзакции
            const task = await DB.addTask(name, description, requirements, additionalreq);

            // Отправляем успешный результат клиенту
            res.status(200).json(task);
        } catch (error) {
            console.error('Error adding transaction:', error);
            res.status(500).json({ message: 'Error adding transaction' });
        }
    }

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