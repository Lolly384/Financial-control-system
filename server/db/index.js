const { Pool } = require('pg');

module.exports = class {
  pool;
  connect = async () => {
    // Конфигурация подключения к базе данных
    this.pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'MyDB', // Ваша база данных
        password: 'admin',
        port: 5432,
    });
    
    // Пример выполнения запроса к базе данных
    this.pool.query('SELECT NOW()', (err, res) => {
        if (err) {
        console.error('Ошибка при выполнении запроса', err.stack);
        } else {
        console.log('Результат запроса:', res.rows[0]);
        }
    });

  
  };
  disconnect = async () => {
    this.pool.end();
  };
};