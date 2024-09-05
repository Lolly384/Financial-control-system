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

const incomeTypes = [
    'Пополнение', 'Зачисление', 'Возврат', 'Пополнение счета'
];

const expenseTypes = [
    'Снятие', 'Перевод', 'Платеж', 'Списание', 'Комиссии', 'Снятие наличных', 'Перевод на карту', 'Оплата услуг'
];

const trimDate = (longDate) => {
    const date = new Date(longDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

export default function Task() {
    const [data, setData] = useState([]);
    const [modalIsOpenAdd, setModalIsOpenAdd] = useState(false);
    const [modalIsOpenChange, setModalIsOpenChange] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [progressMap, setProgressMap] = useState({});
    const itemsPerPage = 1;
    const totalItems = data.length;
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    const getTransactions = async (start, end) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return [];
            }

            console.log('Sending dates:', start, end);
            const url = `/api/getTransactionsDate?startDate=${start}&endDate=${end}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch transactions: ${errorText}`);
            }
            const fetchedData = await response.json();
            return fetchedData;
        } catch (error) {
            console.error("Error executing request:", error);
            return [];
        }
    };

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

            // Calculate progress for each task
            for (const task of fetchedData) {
                await calculateProgress(task);
            }
        } catch (error) {
            console.error("Error executing request:", error);
        }
    };

    const handlePageClick = async ({ selected }) => {
        setCurrentPage(selected);
        const task = data[selected];
        if (!task) return;
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
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await fetch('/api/deleteTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: task.id })
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

    const calculateProgress = async (task) => {
        try {
            const startDate = task.created_at;
            const endDate = new Date();
            // Получаем транзакции для текущей задачи
            const taskTransactions = await getTransactions(trimDate(startDate), trimDate(endDate));
            console.log(taskTransactions);

            // Фильтруем транзакции по типу (доход или расход)
            const incomeTransactions = taskTransactions.filter(transaction => incomeTypes.includes(transaction.type));
            const expenseTransactions = taskTransactions.filter(transaction => expenseTypes.includes(transaction.type));

            // Суммируем все доходы и расходы
            const totalIncomeAmount = incomeTransactions.reduce((total, transaction) => total + parseFloat(transaction.sum), 0);
            const totalExpenseAmount = expenseTransactions.reduce((total, transaction) => total + parseFloat(transaction.sum), 0);

            // Вычисляем прогресс для доходов и расходов отдельно
            const incomeProgress = (totalIncomeAmount / task.amount) * 100;
            const expenseProgress = (totalExpenseAmount / task.amount) * 100;

            // Обновляем прогресс в progressMap
            setProgressMap(prevProgressMap => ({
                ...prevProgressMap,
                [`${task.id}_income`]: { progress: incomeProgress, total: totalIncomeAmount },
                [`${task.id}_expense`]: { progress: expenseProgress, total: totalExpenseAmount }
            }));
        } catch (error) {
            console.error('Error calculating progress:', error);
        }
    };

    useEffect(() => {
        getTask();
    }, []);

    return (
        <>
            <div className='tasks-butGroup'>
                <Modal isOpen={modalIsOpenAdd} onRequestClose={closeModalAdd}>
                    <FormAddTask onCloseModal={closeModalAdd} />
                </Modal>
                <Button onClick={openModalAdd}><img src={addIcon} className='icon' alt='Добавить' /></Button>

                {/* <Modal isOpen={modalIsOpenChange} onRequestClose={closeModalChange}>
                    <FormChangeTask task={data[currentPage]} onCloseModal={closeModalChange} />
                </Modal>
                <Button onClick={openModalChange}><img src={editIcon} className='icon' alt='Изменить' /></Button> */}
                <Button onClick={() => handleDelete(data[currentPage])}><img className='icon' src={delIcon} alt='Удалить' /></Button>
            </div>

            {data
                .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                .map((task, index) => {
                    const defaultProgressData = { progress: 0, total: 0 };
                    const incomeData = progressMap[`${task.id}_income`] || defaultProgressData;
                    const expenseData = progressMap[`${task.id}_expense`] || defaultProgressData;
                    const progressData = task.type === 'Накопить' ? incomeData : expenseData;
                    const isCompleted = progressData.progress >= 100;
                    const taskClass = isCompleted ? 'task-completed' : '';
                    console.log(`Task ${task.id} Progress:`, progressData.progress);
                    return (
                        <div className={`tasks-task ${taskClass}`} key={task.id}>
                            <h2>Задача {index + 1}: {task.name}</h2>
                            <div className="task-type">
                                <h3>Тип:</h3>
                                <p>{task.type}</p>
                            </div>
                            {/* <div className="task-account">
                                <h3>Счёт:</h3>
                                <p>{task.account}</p>
                            </div> */}
                            <div className="task-description">
                                <h3>Описание:</h3>
                                <p>{task.description}</p>
                            </div>
                            <div className="task-amount">
                                <h3>Сумма:</h3>
                                <p>{task.amount} ₽ | {progressData.total.toFixed(2)} ₽ </p>
                            </div>
                            <div className="task-created-at">
                                <h3>Создано:</h3>
                                <p>{trimDate(task.created_at)}</p>
                            </div>

                            {/* Render progress */}
                            <div className="task-progress">
                                <h3>Прогресс:</h3>
                                <p>{progressData.progress.toFixed(2)}%</p>
                            </div>

                            {/* Progress bar */}
                            <div className="task-progress-bar">
                                <div className="progress-bar-background">
                                    <div className="progress-bar-fill" style={{ width: `${progressData.progress}%` }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

            {/* Pagination */}
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
