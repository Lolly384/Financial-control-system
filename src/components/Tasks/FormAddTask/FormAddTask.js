import React, { useState, useEffect } from 'react';
import Button from '../../Button/Button';
import './FormAddTask.css';

export default function FormAddTask({ onCloseModal }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Накопить', // Значение по умолчанию
        account: '',
        description: '',
        amount: ''
    });

    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('/api/getAccounts', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch accounts');
                }
                const data = await response.json();
                setAccounts(data);
                if (data.length > 0) {
                    setFormData((prevData) => ({ ...prevData, account: data[0].name })); // Устанавливаем первый счет как значение по умолчанию
                }
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        fetchAccounts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/addTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            console.log('Task added successfully');
            onCloseModal();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <div className="form-content">
            <h2>Добавить новую задачу</h2>
            <form onSubmit={handleSubmit} className="form">
                <label className="form-label">
                    Наименование:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" />
                </label>
                <label className="form-label">
                    Тип задачи:
                    <select name="type" value={formData.type} onChange={handleChange} required className="form-select">
                        <option value="Накопить">Накопить</option>
                        <option value="Потратить">Потратить</option>
                    </select>
                </label>
                {/* <label className="form-label">
                    Счёт:
                    <select name="account" value={formData.account} onChange={handleChange} required className="form-select">
                        {accounts.map((account) => (
                            <option key={account.name} value={account.name}>
                                {account.name}
                            </option>
                        ))}
                    </select>
                </label> */}
                <label className="form-label">
                    Описание:
                    <textarea name="description" value={formData.description} onChange={handleChange} required className="form-textarea" />
                </label>
                <label className="form-label">
                    Сумма:
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="form-input" />
                </label>
                <div className="form-button-group">
                    <Button type="submit" className="modal-button">Добавить</Button>
                    <Button type="button" onClick={onCloseModal} className="modal-button">Отмена</Button>
                </div>
            </form>
        </div>
    );
}
