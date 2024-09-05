import React, { useState } from 'react';
import './UserProfile.css';

export default function UserProfile({ username, onUpdate, onClose }) {
    const [newUsername, setNewUsername] = useState(username);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleUpdate = () => {
        onUpdate({ username: newUsername, email, password });
        onClose();
    };

    return (
        <div className="user-profile">
            <h2>Профиль пользователя</h2>
            <label>
                Имя пользователя:
                <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
            </label>
            <label>
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <label>
                Пароль:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <button onClick={handleUpdate}>Сохранить</button>
            <button onClick={onClose}>Отмена</button>
        </div>
    );
}
