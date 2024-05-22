import React, { useState } from 'react';
import Button from '../../Button/Button';

export default function FormAddTask({onCloseModal}) {
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
        <form onSubmit={handleSubmit}>
            <label>
                Название:
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </label>
            <label>
                Описание:
                <textarea name="description" value={formData.description} onChange={handleChange} />
            </label>
            <label>
                Требования:
                <textarea name="requirements" value={formData.requirements} onChange={handleChange} />
            </label>
            <label>
                Дополнительные требования:
                <textarea name="additionalreq" value={formData.additionalreq} onChange={handleChange} />
            </label>
            <Button type="submit">Добавить</Button>
        </form>
    );
}
