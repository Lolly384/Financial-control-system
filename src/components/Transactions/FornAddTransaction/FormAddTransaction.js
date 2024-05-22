import React, { useState, useEffect } from 'react';
import './FormAddTransaction.css';
import Button from '../../Button/Button';

export default function FormAddTransaction({ onTransactionAdded }) {
    const [formData, setFormData] = useState({
        type: '',
        sum: '',
        date: '',
        category: '',
        description: '',
        recipient: '',
        sender: '',
        status: '',
        accounts: ''
    });

    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/getAccounts', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setAccounts(data);
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        fetchAccounts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "sum" && !isNaN(value) && /^\d*\.?\d{0,2}$/.test(value)) {
            setFormData({ ...formData, [name]: value });
        } else if (name !== "sum") {
            setFormData({ ...formData, [name]: value });
        }
    };

    const updateAccountBalance = async (accountName, newBalance) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/updateAccountBalance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ accountName, newBalance })
            });

            if (!response.ok) {
                console.error('Error updating account balance');
            }
        } catch (error) {
            console.error('Error updating account balance:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/addTransaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const account = accounts.find(account => account.id === formData.accounts);
                if (account) {
                    const newBalance = calculateNewBalance(account.balance, formData.type, parseFloat(formData.sum));
                    
                    await updateAccountBalance(account.name, newBalance);
                }
                await onTransactionAdded();
                console.log('Transaction added successfully');
            } else {
                console.error('Error adding transaction');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const calculateNewBalance = (currentBalance, transactionType, amount) => {
        switch (transactionType) {
            case 'Пополнение':
            case 'Зачисление':
            case 'Возврат':
            case 'Пополнение счета':
                return currentBalance + amount;
            case 'Снятие':
            case 'Перевод':
            case 'Платеж':
            case 'Списание':
            case 'Комиссии':
            case 'Снятие наличных':
            case 'Перевод на карту':
            case 'Оплата услуг':
                return currentBalance - amount;
            default:
                return currentBalance;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Тип операции:
                <select name="type" value={formData.type} onChange={handleChange} required>
                    <option value="">Выберите тип операции</option>
                    <option value="Пополнение">Пополнение</option>
                    <option value="Снятие">Снятие</option>
                    <option value="Перевод">Перевод</option>
                    <option value="Возврат">Возврат</option>
                    <option value="Платеж">Платеж</option>
                    <option value="Автоплатеж">Автоплатеж</option>
                    <option value="Списание">Списание</option>
                    <option value="Зачисление">Зачисление</option>
                    <option value="Покупки">Покупки</option>
                    <option value="Оплата услуг">Оплата услуг</option>
                    <option value="Снятие наличных">Снятие наличных</option>
                    <option value="Перевод на карту">Перевод на карту</option>
                    <option value="Пополнение счета">Пополнение счета</option>
                    <option value="Комиссии">Комиссии</option>
                    <option value="Инвестиции">Инвестиции</option>
                    <option value="Депозиты">Депозиты</option>
                    <option value="Страхование">Страхование</option>
                    <option value="Другое">Другое</option>
                </select>
            </label>
            <label>
                Сумма:
                <input type="number" name="sum" value={formData.sum} onChange={handleChange} placeholder="00.00" required />
            </label>
            <label>
                Дата:
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </label>
            <label>
                Категория:
                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Выберите категорию</option>
                    <option value="Еда">Еда</option>
                    <option value="Жилье">Жилье</option>
                    <option value="Транспорт">Транспорт</option>
                    <option value="Здоровье">Здоровье</option>
                    <option value="Одежда и обувь">Одежда и обувь</option>
                    <option value="Развлечения">Развлечения</option>
                    <option value="Путешествия">Путешествия</option>
                    <option value="Образование">Образование</option>
                    <option value="Коммунальные платежи">Коммунальные платежи</option>
                    <option value="Связь и интернет">Связь и интернет</option>
                    <option value="Домашние животные">Домашние животные</option>
                    <option value="Продукты">Продукты</option>
                    <option value="Рестораны и кафе">Рестораны и кафе</option>
                    <option value="Спорт и фитнес">Спорт и фитнес</option>
                    <option value="Красота и уход">Красота и уход</option>
                    <option value="Техника и электроника">Техника и электроника</option>
                    <option value="Ремонт и строительство">Ремонт и строительство</option>
                    <option value="Финансовые услуги">Финансовые услуги</option>
                    <option value="Подарки и праздники">Подарки и праздники</option>
                    <option value="Благотворительность">Благотворительность</option>
                    <option value="Налоги">Налоги</option>
                    <option value="Другое">Другое</option>
                </select>
            </label>
            <label>
                Описание:
                <input type="text" name="description" value={formData.description} onChange={handleChange} />
            </label>
            <label>
                Получатель:
                <input type="text" name="recipient" value={formData.recipient} onChange={handleChange} />
            </label>
            <label>
                Отправитель:
                <input type="text" name="sender" value={formData.sender} onChange={handleChange} />
            </label>
            <label>
                Статус:
                <select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="">Выберите статус операции</option>
                    <option value="Успешно">Успешно</option>
                    <option value="Неудачно">Неудачно</option>
                </select>
            </label>
            <label>
                Счет:
                <select name="accounts" value={formData.accounts} onChange={handleChange} required>
                    <option value="">Выберите счет</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                            {account.name}
                        </option>
                    ))}
                </select>
            </label>
            <Button type="submit">Добавить</Button>
        </form>
    );
}
