import React, { useState } from 'react';
import './Tasks.css';
import Button from '../Button/Button';
import ReactPaginate from 'react-paginate';
import Task from './Task/Task';
import FormAddTask from './FormAddTask/FormAddTask';
import Modal from 'react-modal';

export default function Tasks() {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };


    return (
        <section className='tasks'>
            <div className='tasks-butGroup'>
                <Button onClick={openModal}>Добавить</Button>
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                    <FormAddTask />
                </Modal>
                <Button>Изменить</Button>
                <Button>Удалить</Button>
            </div>
            <Task />
           
            
        </section>
    );
}
