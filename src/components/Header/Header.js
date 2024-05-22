import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Button from '../Button/Button';
import AuthForm from './AuthForm/AuthForm';
import './Header.css';

export default function Header() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [username, setUsername] = useState(null);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleLogin = async (token, user) => {
        console.log(user)
        setUsername(user.username); // Устанавливаем имя пользователя
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const token = localStorage.getItem('token');
            if (token) {
                const user = { username: token.username }; // Замените на получение информации о пользователе
                handleLogin(token, user);
            }

        }
    }, []);

    return (
        <header className="App-header">
            <h1><i>Name system</i></h1>
            <div className='App-header-group'>
                {username ? (
                    <p><strong>{username}</strong></p>
                ) : (
                    <Button onClick={openModal}><strong>Log In</strong></Button>
                )}
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                    <AuthForm onClose={closeModal} onLogin={handleLogin} />
                </Modal>
            </div>
        </header>
    );
}
