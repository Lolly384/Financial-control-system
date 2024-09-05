import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { jwtDecode } from 'jwt-decode'; // Изменено импортирование jwtDecode
import Button from '../Button/Button';
import AuthForm from './AuthForm/AuthForm';
import './Header.css';
import imgUser from './icons8-пользователь-50 (1).png';
import imgLogo from './icons8-монеты-80.png';
import logoutIcon from './free-icon-logout-660350.png';

export default function Header() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [username, setUsername] = useState(null);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleLogin = async (token) => {
        localStorage.setItem('token', token); // Сохраняем токен в localStorage
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username); // Устанавливаем имя пользователя из токена
        closeModal(); // Закрываем модальное окно после успешной авторизации
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.username); // Устанавливаем имя пользователя из токена
        } else {
            openModal(); // Открываем модальное окно, если токен отсутствует
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Удаляем токен из localStorage
        setUsername(null); // Устанавливаем имя пользователя в null
        window.location.reload();
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
