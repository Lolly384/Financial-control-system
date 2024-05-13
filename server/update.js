const db = require('./db');
const DB = new db();

class Update {
    updateTransaction(transactionId, newData) {
        // Предположим, что у вас есть метод db.updateTransaction для выполнения запроса на обновление данных в базе данных
        return DB.updateTransaction(transactionId, newData);
    }
}

module.exports = Update;
