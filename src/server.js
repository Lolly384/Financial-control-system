
const { Pool } = require('pg');

// Конфигурация подключения к базе данных
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MyDB', // Ваша база данных
  password: 'admin',
  port: 5432,
});

// Пример выполнения запроса к базе данных
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Ошибка при выполнении запроса', err.stack);
  } else {
    console.log('Результат запроса:', res.rows[0]);
  }
});

// Закрытие пула подключений к базе данных
pool.end();
