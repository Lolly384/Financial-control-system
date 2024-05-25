import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Button from '../../Button/Button';
import FormAddTask from '../FormAddTask/FormAddTask';
import Modal from 'react-modal';
import FormChangeTask from '../FormChangeTask/FormChangeTask';
import './Task.css';
import delIcon from './free-icon-delete-1214428.png';
import addIcon from './free-icon-add-square-outlined-interface-button-54731.png';
import editIcon from './free-icon-edit-1159633.png';

export default function Task() {
    const [data, setData] = useState([]);
    const [modalIsOpenAdd, setModalIsOpenAdd] = useState(false);
    const [modalIsOpenChange, setModalIsOpenChange] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 1;
    const totalItems = data.length;
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    const getTask = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await fetch("/api/getTask", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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
        getTask();
    };

    const closeModalChange = () => {
        setModalIsOpenChange(false);
        getTask();
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
            getTask();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <>
            <div className='tasks-butGroup'>
                <Modal isOpen={modalIsOpenAdd} onRequestClose={closeModalAdd}>
                    <FormAddTask onCloseModal={closeModalAdd} />
                </Modal>
                <Button onClick={openModalAdd}><img src={addIcon} className='icon' alt='Добавить' /></Button>

                <Modal isOpen={modalIsOpenChange} onRequestClose={closeModalChange}>
                    <FormChangeTask task={data[currentPage]} onCloseModal={closeModalChange} />
                </Modal>
                <Button onClick={openModalChange}><img src={editIcon} className='icon' alt='Изменить' /></Button>
                <Button onClick={() => handleDelete(data[currentPage])}><img className='icon' src={delIcon} alt='Удалить' /></Button>
            </div>
            {data
                .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                .map((task, index) => (
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
                ))}
            <div className='tasks-button'>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
                <ReactPaginate
                    pageCount={pageCount}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    previousLabel={<i className="fas fa-chevron-left"></i>}
                    nextLabel={<i className="fas fa-chevron-right"></i>}
                    breakLabel={"..."}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    pageClassName="page-item"
                />
            </div>
        </>
    );
}
