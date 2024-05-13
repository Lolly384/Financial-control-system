const db = require('../db');
const DB = new db();

module.exports = class {
    getTask = async(req,res) =>{
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
    
}