const { Pool } = require('pg');
const jwt = require('jsonwebtoken');



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

  // Get
  getTransactions = async (username) => {
    try {
      // Выполняем запрос к базе данных для получения транзакций пользователя
      const result = await this.pool.query('SELECT * FROM transactions WHERE username = $1', [username]);
      return result.rows;
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      throw error;
    }
  };
  getTransactionsCurrentMonth = async (username, startDate, endDate) => {
    try {
      // Выполняем запрос к базе данных для получения транзакций пользователя за заданный период
      const result = await this.pool.query(`
            SELECT * FROM transactions 
            WHERE username = $1 
            AND date >= $2
            AND date <= $3;
        `, [username, startDate, endDate]);
      return result.rows;
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      throw error;
    }
  };

  getTransactionsDate = async (username, startDate, endDate) => {
    try {
      console.log('Querying database with:', username, startDate, endDate); // Логируем параметры запроса
      const result = await this.pool.query(`
            SELECT * FROM transactions 
            WHERE username = $1 
            AND date >= $2
            AND date <= $3;
        `, [username, startDate, endDate]);
      return result.rows;
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      throw error;
    }
  };

  getTransactionsProgress = async (username, accounts, startDate, endDate) => {
    try {
      const result = await this.pool.query(`
        SELECT * FROM transactions 
        WHERE username = $1 
        AND account = $2
        AND date >= $3
        AND date <= $4;
    `, [username, accounts, startDate, endDate]);

      return result.rows;
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      throw error;
    }
  };

  getTask = async (username) => {
    try {
      // Выполнение запроса к базе данных для получения данных из таблицы transactions
      const result = await this.pool.query('SELECT * FROM tasks WHERE username = $1', [username]);
      return result.rows; // Возвращаем массив объектов с данными из таблицы
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      throw error; // Пробрасываем ошибку, чтобы обработать её в вызывающем коде
    }
  };

  // Add
  addTransaction = async (type, sum, date, category, description, recipient, sender, status, accountName, username) => {
    try {
        const queryString = `
            INSERT INTO transactions (type, sum, date, category, description, recipient, sender, status, accounts, username) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`;
        const values = [type, sum, date, category, description, recipient, sender, status, accountName, username];

        const result = await this.pool.query(queryString, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding transaction to DB:', error);
        throw error;
    }
};

  addTask = async (name, type, account, description, amount, progress, createdAt, username) => {
    const query = `
        INSERT INTO tasks (name, type, account, description, amount, progress, created_at, username)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
    const values = [name, type, account, description, amount, progress, createdAt, username];

    const { rows } = await this.pool.query(query, values);
    return rows[0];
  };


  // delete
  deleteTransaction = async (transaction_id) => {
    console.log(transaction_id);
    try {
      const queryString = "DELETE FROM transactions WHERE transaction_id = $1";
      const values = [transaction_id];
      const result = await this.pool.query(queryString, values);

      if (result.rowCount === 0) {
        console.error('Error adding transaction to DB:', error);
        // Если ни одна строка не была удалена, то транзакция с заданным id не была найдена
        return null;
      }

      // Возвращаем результат удаления
      return result.rowCount;
    } catch (error) {
      throw new Error('Ошибка при удалении транзакции из базы данных:', error);
    }
  }

  deleteTask = async (id) => {
    try {
      const queryString = "DELETE FROM tasks WHERE id = $1";
      const values = [id];
      const result = await this.pool.query(queryString, values);

      if (result.rowCount === 0) {
        console.error('Error adding task to DB:', error);
        // Если ни одна строка не была удалена, то транзакция с заданным id не была найдена
        return null;
      }

      // Возвращаем результат удаления
      return result.rowCount;
    } catch (error) {
      throw new Error('Ошибка при удалении транзакции из базы данных:', error);
    }
  }

  //Change
  async changeTask(id, name, description, requirements, additionalreq) {
    try {
      const queryString = `
        UPDATE task 
        SET name = $2, description = $3, requirements = $4, additionalreq = $5
        WHERE id = $1`;
      const values = [id, name, description, requirements, additionalreq];
      const result = await this.pool.query(queryString, values);

      if (result.rowCount === 0) {
        console.error('Error changing task in DB: No rows affected');
        // Если ни одна строка не была изменена, то задача с заданным id не была найдена
        return null;
      }

      // Возвращаем результат изменения
      return result.rowCount;
    } catch (error) {
      throw new Error('Ошибка при изменении задачи в базе данных: ' + error.message);
    }
  }

  async changeTransaction(transaction_id, type, sum, date, category, description, recipient, sender, status, accounts) {
    try {
      const queryString = `
            UPDATE transactions 
            SET type = $2, sum = $3, date = $4, category = $5, description = $6, recipient = $7, sender = $8, status = $9, accounts = $10
            WHERE transaction_id = $1`;
      const values = [transaction_id, type, sum, date, category, description, recipient, sender, status, accounts];
      const result = await this.pool.query(queryString, values);

      if (result.rowCount === 0) {
        console.error('Error changing transaction in DB: No rows affected');
        // Если ни одна строка не была изменена, то задача с заданным id не была найдена
        return null;
      }

      // Возвращаем результат изменения
      return result.rowCount;
    } catch (error) {
      throw new Error('Ошибка при изменении транзакции в базе данных: ' + error.message);
    }
  }



  registrUser = async (email, username, password) => {

    try {
      const queryString = `INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *`;
      const values = [email, username, password];

      const result = await this.pool.query(queryString, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding user to DB:', error);
      throw error;
    }
  };

  loginUser = async (username, password) => {
    try {
      const queryString = `SELECT id, email, username FROM users WHERE username = $1 AND password = $2`;
      const values = [username, password];
      const result = await this.pool.query(queryString, values);

      if (result.rows.length === 0) {
        throw new Error('Invalid username or password');
      }

      const user = result.rows[0];
      const secretKey = process.env.JWT_SECRET || 'your_secret_key_here';


      const token = jwt.sign({
        userId: user.id,
        username: user.username,
        email: user.email
      }, secretKey, { expiresIn: '1h' }); // Установка срока действия токена

      return { token, user };
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  };


  getAccounts = async (username) => {
    try {
      const result = await this.pool.query('SELECT * FROM accounts WHERE username = $1', [username]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  }

  addAccount = async (name, balance, username) => {
    try {
      const result = await this.pool.query(
        'INSERT INTO accounts (name, balance, username) VALUES ($1, $2, $3) RETURNING *',
        [name, balance, username]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    }
  }

  updateAccountBalance = async (id, newBalance) => {
    try {
      // Проверка на существование счета с уникальным именем
      const checkResult = await this.pool.query(
        'SELECT * FROM accounts WHERE id = $1',
        [id]
      );

      if (checkResult.rowCount === 0) {
        throw new Error('Account not found');
      }

      // Обновление баланса счета
      const result = await this.pool.query(
        'UPDATE accounts SET balance = $1 WHERE id = $2 RETURNING *',
        [newBalance, id]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error updating account balance DB:', error);
      throw error;
    }
  };

  deleteAccount = async (id) => {
    try {
      const queryString = "DELETE FROM accounts WHERE id = $1";
      const values = [id];
      const result = await this.pool.query(queryString, values);

      if (result.rowCount === 0) {
        console.error('Error delete accounts to DB:', error);
        // Если ни одна строка не была удалена, то транзакция с заданным id не была найдена
        return null;
      }

      // Возвращаем результат удаления
      return result.rowCount;
    } catch (error) {
      throw new Error('Ошибка при удалении транзакции из базы данных:', error);
    }
  }

};
