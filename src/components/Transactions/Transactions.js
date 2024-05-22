import React, { useState, useEffect } from 'react';
import './Transactions.css';
import Modal from 'react-modal';
import Button from '../Button/Button';
import FormAddTransaction from './FornAddTransaction/FormAddTransaction';
import TableTransaction from './TableTransaction/TableTransaction';

export default function Transactions() {
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для отслеживания открытия/закрытия модального окна
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [tableDataChanged, setTableDataChanged] = useState(false);
    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };
    const handleTransactionAdded = async () => {
        // Закрыть модальное окно после добавления транзакции
        closeModal();
        // Обновить таблицу после добавления транзакции
        // Установить флаг изменения данных таблицы
        setTableDataChanged(true);
    };
    

    return (
        <section className="transactions">
            <div className='transactions-butGroup'>
                <Button onClick={openModal}>Добавить</Button>
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                    <FormAddTransaction onTransactionAdded={handleTransactionAdded} />
                </Modal>
            </div>
            {!isModalOpen && (
                <>
                    <TableTransaction tableDataChanged={tableDataChanged} setTableDataChanged={setTableDataChanged}/>
                </>
            )}

            
        </section>
    );
}
