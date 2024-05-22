import React, { useState, useEffect } from 'react';
import Button from '../../Button/Button';

export default function FormChangeTask({ task, onCloseModal }) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        requirements: '',
        additionalreq: ''
    });
    console.log(formData);
    // Заполняем значения формы данными из задачи при монтировании компонента
    useEffect(() => {
        if (task) {
            setFormData({
                id: task.id || '',
                name: task.name || '',
                description: task.description || '',
                requirements: task.requirements || '',
                additionalreq: task.additionalreq || ''
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('api/changeTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to change task');
            }
            console.log('Task added successfully');

            // Закрываем модальное окно
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
            <Button type="submit">Изменить</Button>
        </form>
    );
}
