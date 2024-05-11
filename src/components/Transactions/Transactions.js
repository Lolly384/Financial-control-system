import React, { useState, useEffect } from 'react';
import './Transactions.css';
import Button from '../Button/Button';
import FormAddTransaction from './FornAddTransaction/FormAddTransaction';
import TableTransaction from './TableTransaction/TableTransaction';

export default function Transactions() {
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для отслеживания открытия/закрытия модального окна

    const openModal = () => {
        setIsModalOpen(true); // Открываем модальное окно
    };

    return (
        <section className="transactions">
            <div className='transactions-butGroup'>
                <Button onClick={openModal}>Добавить</Button>
            </div>
            {!isModalOpen && (
                <>
                    <TableTransaction />
                </>
            )}

            {isModalOpen && (
                <>
                    <FormAddTransaction />
                </>
            )}
        </section>
    );
}
