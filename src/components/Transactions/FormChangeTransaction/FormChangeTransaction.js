import React, { useState } from 'react';
import Button from '../../Button/Button';

export default function FormChangeTransaction({transaction, onTransactionChange}) {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();

        if (month.length === 1) {
            month = '0' + month;
        }

        if (day.length === 1) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({
        transaction_id: transaction.transaction_id || '',
        type: transaction.type || '',
        sum: transaction.sum || '',
        date: formatDate(transaction.date) || '', // Преобразование даты
        category: transaction.category || '',
        description: transaction.description || '',
        recipient: transaction.recipient || '',
        sender: transaction.sender || '',
        status: transaction.status || '',
        accounts: transaction.accounts || ''
    });

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        //Проверяем, если введенное значение не является числом или не более 2 цифр после запятой, то обновляем состояние
        if (name === "sum" && !isNaN(value) && /^\d*\.?\d{0,2}$/.test(value)) {
            setFormData({ ...formData, [name]: value });
        } else if (name !== "sum") {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('api/changeTransaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log('Transaction changed successfully');
                // После успешного изменения транзакции вызываем функцию для обновления данных транзакций
                onTransactionChange();
            } else {
                throw new Error('Failed to change transaction');
            }
            console.log('Transaction added successfully');
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };


    return (
        <form className="transaction-form" onSubmit={handleSubmit}>
            <label>
                Тип операции:
                <select name="type" value={formData.type} onChange={handleChange} required>
                    <option value="">Выберите тип операции</option>
                    <option value="Перевод">Перевод</option>
                    <option value="Возврат">Возврат</option>
                    <option value="Платешь">Платешь</option>
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
                <input type="number" name="sum" value={formData.sum} onChange={handleChange} placeholder="00.00" />
            </label>
            <label>
                Дата:
                <input type="date" name="date" value={formData.date} onChange={handleChange} required/>
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
                    {/* Добавьте другие категории по аналогии */}
                </select>
            </label>
            <label>
                Счет:
                <input type="text" name="accounts" value={formData.accounts} onChange={handleChange} />
            </label>
            <Button type="submit" >Изменить</Button>

        </form>
    );
}
