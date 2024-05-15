import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Button from '../../Button/Button';
import FormAddTask from '../FormAddTask/FormAddTask';
import Modal from 'react-modal';
import FormChangeTask from '../FormChangeTask/FormChangeTask';

export default function Task() {
    const [data, setData] = useState([]);
    const [modalIsOpenAdd, setModalIsOpenAdd] = useState(false); // Состояние для модального окна добавления
    const [modalIsOpenChange, setModalIsOpenChange] = useState(false); // Состояние для модального окна изменения
    const [currentPage, setCurrentPage] = useState(0); // текущая страница пагинации
    const itemsPerPage = 1; // количество элементов на странице
    const totalItems = data.length; // общее количество элементов
    const pageCount = Math.ceil(totalItems / itemsPerPage); // количество страниц


    const getTask = async () => {
        try {
            const response = await fetch("/api/getTask");
            const fetchedData = await response.json();
            setData(fetchedData);
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };

    useEffect(() => {
        getTask();
    }, []);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const openModalAdd = () => {
        setModalIsOpenAdd(true);
    };

    const openModalChange = () => {
        setModalIsOpenChange(true);
    };

    const closeModalAdd = () => {
        setModalIsOpenAdd(false);
    };

    const closeModalChange = () => {
        setModalIsOpenChange(false);
    };

    const handleDelete = async (task) => {
        try {
            const response = await fetch('/api/deleteTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            console.log('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <>
            {data
                .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                .map((task, index) => (
                    <>
                        <div className='tasks-butGroup'>
                            <Modal isOpen={modalIsOpenAdd} onRequestClose={closeModalAdd}>
                                <FormAddTask />
                            </Modal>
                            <Button onClick={openModalAdd}>Добавить</Button>

                            <Modal isOpen={modalIsOpenChange} onRequestClose={closeModalChange}>
                                <FormChangeTask task={task} />
                            </Modal>
                            <Button onClick={openModalChange}>Изменить</Button>

                            <Button key={index} onClick={() => handleDelete(task)}>Удалить</Button>
                        </div>
                        <div className='tasks-task' key={index}>

                            <h2>Задача {index}: {task.name}</h2>
                            <div className="task-description">
                                <h3>Описание:</h3>
                                <p>{task.description}</p>
                            </div>
                            <div className="task-steps">
                                <h3>Требования</h3>
                                <ul>
                                    <li>{task.requirements}</li>
                                </ul>
                            </div>
                            <div className="additional-requirements">
                                <h3>Дополнительные требования:</h3>
                                <ul>
                                    <li>{task.additionalreq}</li>
                                </ul>
                            </div>
                        </div>
                    </>
                ))}
            <div className='tasks-button'>
                <ReactPaginate
                    pageCount={pageCount}
                    pageRangeDisplayed={5} // количество отображаемых страниц
                    marginPagesDisplayed={1} // количество видимых страниц в начале и в конце пагинации
                    previousLabel={"Пред."}
                    nextLabel={"След."}
                    breakLabel={"..."}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                />
            </div>
        </>
    );
}
