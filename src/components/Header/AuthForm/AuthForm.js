import React, { useState } from 'react';
import Button from '../../Button/Button';
import './AuthForm.css';

export default function AuthForm({ onClose, onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });

    const toggleForm = () => {
        setIsRegister(!isRegister);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isRegister ? '/api/register' : '/api/login';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to submit form');
            }
            const data = await response.json();
            if (!isRegister) {
                localStorage.setItem('token', data.token);
                onLogin(data.token, data.user); // Передаем и токен, и данные пользователя
            }
            onClose(); // Закрываем модальное окно после отправки
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form className='form' onSubmit={handleSubmit}>
            <h2>{isRegister ? 'Регистрация' : 'Авторизация'}</h2>
            {isRegister && (
                <div>
                    <label>
                        Email:
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </label>
                </div>
            )}
            <div>
                <label>
                    Username:
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </label>
            </div>
            <div className='butGroup'>
                <Button type="submit">{isRegister ? 'Регистрация' : 'Авторизация'}</Button>
                <Button type="button" onClick={toggleForm}>
                    {isRegister ? 'У вас уже есть аккаунт? Авторизоваться' : 'У вас нет учетной записи? Регистрация'}
                </Button>
            </div>
        </form>
    );
}
