import React, { useState } from 'react';
import './FormAddTransaction.css'
import Button from '../../Button/Button';

export default function FormAddTransaction() {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('api/addTransaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to add transaction');
            }
            console.log('Transaction added successfully');
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Тип операции:
                <input type="text" name="type" value={formData.type} onChange={handleChange} />
            </label>
            <label>
                Сумма:
                <input type="text" name="sum" value={formData.sum} onChange={handleChange} />
            </label>
            <label>
                Дата:
                <input type="text" name="date" value={formData.date} onChange={handleChange} />
            </label>
            <label>
                Категория:
                <input type="text" name="category" value={formData.category} onChange={handleChange} />
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
                <input type="text" name="status" value={formData.status} onChange={handleChange} />
            </label>
            <label>
                Счет:
                <input type="text" name="accounts" value={formData.accounts} onChange={handleChange} />
            </label>
            <Button type="submit">Добавить</Button>
        </form>
    );
}
