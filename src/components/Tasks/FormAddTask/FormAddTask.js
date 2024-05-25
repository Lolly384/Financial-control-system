import React, { useState } from 'react';
import Button from '../../Button/Button';
import './FormAddTask.css';

export default function FormAddTask({ onCloseModal }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        requirements: '',
        additionalreq: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('api/addTask', {
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
                    Название:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" />
                </label>
                <label className="form-label">
                    Описание:
                    <textarea name="description" value={formData.description} onChange={handleChange} required className="form-textarea" />
                </label>
                <label className="form-label">
                    Требования:
                    <textarea name="requirements" value={formData.requirements} onChange={handleChange} required className="form-textarea" />
                </label>
                <label className="form-label">
                    Дополнительные требования:
                    <textarea name="additionalreq" value={formData.additionalreq} onChange={handleChange} required className="form-textarea" />
                </label>
                <div className="form-button-group">
                    <Button type="submit" className="modal-button">Добавить</Button>
                    <Button type="button" onClick={onCloseModal} className="modal-button">Отмена</Button>
                </div>
            </form>
        </div>
    );
}
