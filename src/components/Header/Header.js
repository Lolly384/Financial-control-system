import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Button from '../Button/Button';
import AuthForm from './AuthForm/AuthForm';
import './Header.css';
import imgUser from './icons8-пользователь-50 (1).png';
import imgLogo from './icons8-монеты-80.png';
import logoutIcon from './free-icon-logout-660350.png';

export default function Header() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [username, setUsername] = useState(null);
    const [accounts, setAccounts] = useState([]);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleLogin = async (token, user) => {
        localStorage.setItem('token', token); // Сохраняем токен в localStorage
        setUsername(user.username); // Устанавливаем имя пользователя
        closeModal(); // Закрываем модальное окно после успешной авторизации
    };

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('/api/getUser', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const user = await response.json();
            setUsername(user.username); // Устанавливаем имя пользователя после успешного получения данных
        } catch (error) {
            console.error('Error fetching user data:', error);
            localStorage.removeItem('token'); // Удаляем токен при ошибке
            setUsername(null); // Сбрасываем имя пользователя
            openModal(); // Открываем модальное окно для входа
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserData();
        } else {
            openModal(); // Открываем модальное окно, если токен отсутствует
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Удаляем токен из localStorage
        setUsername(null); // Устанавливаем имя пользователя в null
        openModal(); // Открываем модальное окно авторизации
    };

    return (
        <header className="App-header">
            <div className='header-logo'>
                <img className='header_user_logo' src={imgLogo} alt="Account Icon" />
                <p>MonyMenedger</p>
            </div>
            <div className='App-header-group'>
                {username ? (
                    <>
                        <div className='user_avtorisovan'>
                            <img className='header_user_logo' src={imgUser} alt="Account Icon" />
                            <p>{username}</p>
                        </div>
                        <Button onClick={handleLogout}>
                            <img className='icon' src={logoutIcon} alt='Выйти с аккаунта' />
                        </Button>
                    </>
                ) : (
                    <Button onClick={openModal}>Log In</Button>
                )}
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                    <AuthForm onClose={closeModal} onLogin={handleLogin} />
                </Modal>
            </div>
        </header>
    );
}
