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
            

            let dateNow = new Date(); // Для денчика - нужен верный формат даты из клиента, пока что просто текущую дату

            // Вызываем метод addTransaction из вашего модуля DB, передавая ему данные транзакции
            const transaction = await DB.addTransaction(type, sum, dateNow, category, description, recipient, sender, status, accounts);
            
            // Отправляем успешный результат клиенту
            res.status(200).json(transaction);
        } catch (error) {
            console.error('Error adding transaction:', error);
            res.status(500).json({ message: 'Error adding transaction' });
        }
    }

    deleteTransaction = async (req, res) => {
        console.log(req.params);
        const { id } = req.params;
        try {
            const deletedTransaction = await Transaction.findByIdAndDelete(id);
            if (!deletedTransaction) {
                return res.status(404).json({ message: 'Транзакция не найдена' });
            }
            res.status(200).json({ message: 'Транзакция успешно удалена', deletedTransaction });
        } catch (error) {
            console.error('Ошибка при удалении транзакции:', error);
            res.status(500).json({ message: 'Ошибка при удалении транзакции' });
        }
    };
}