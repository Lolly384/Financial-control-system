const { Pool } = require('pg');

module.exports = class {
  pool;

  constructor() {
    if (this.pool === undefined || this.pool === null) {
      this.connect();
    }
  }

  connect = async () => {
    // Конфигурация подключения к базе данных
    this.pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'MyDB', // Ваша база данных
      password: 'admin',
      port: 5432,
    });
  };

  disconnect = async () => {
    this.pool.end();
  };

  getTransactions = async () => {
    try {
      // Выполнение запроса к базе данных для получения данных из таблицы transactions
      const result = await this.pool.query('SELECT * FROM transactions');
      return result.rows; // Возвращаем массив объектов с данными из таблицы
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      throw error; // Пробрасываем ошибку, чтобы обработать её в вызывающем коде
    }
  };

  addTransaction = async (type, sum, date, category, description, recipient, sender, status, accounts) => {
    try {
      const queryString = `INSERT INTO transactions (type, sum, date, category, description, recipient, sender, status, accounts) 
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                            RETURNING *`;
      const values = [type, sum, date, category, description, recipient, sender, status, accounts];

      const result = await this.pool.query(queryString, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding transaction to DB:', error);
      throw error;
    }
  };

};
