import './SectionTask.css';
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

export default function SectionTask() {
    const [tasksData, setTasksData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const tasksPerPage = 1;

    const trimDate = (longDate) => {
        const date = new Date(longDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
    };

    const incomeTypes = [
        'Пополнение', 'Зачисление', 'Возврат', 'Пополнение счета'
    ];

    const expenseTypes = [
        'Снятие', 'Перевод', 'Платеж', 'Списание', 'Комиссии', 'Снятие наличных', 'Перевод на карту', 'Оплата услуг'
    ];

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

    const calculateProgress = async (task) => {
        try {
            console.log(task);
            const startDate = task.created_at;
            const endDate = new Date();
            const taskTransactions = await getTransactions(trimDate(startDate), trimDate(endDate));
            console.log(taskTransactions);

            const incomeTransactions = taskTransactions.filter(transaction => incomeTypes.includes(transaction.type));
            const expenseTransactions = taskTransactions.filter(transaction => expenseTypes.includes(transaction.type));

            const totalIncomeAmount = incomeTransactions.reduce((total, transaction) => total + parseFloat(transaction.sum), 0);
            const totalExpenseAmount = expenseTransactions.reduce((total, transaction) => total + parseFloat(transaction.sum), 0);

            const incomeProgress = (totalIncomeAmount / task.amount) * 100;
            const expenseProgress = (totalExpenseAmount / task.amount) * 100;

            console.log('Income Progress:', incomeProgress);
            console.log('Expense Progress:', expenseProgress);

            return {
                ...task,
                progress: typeof incomeProgress === 'number' ? incomeProgress : 0
            };
        } catch (error) {
            console.error('Error calculating progress:', error);
            return {
                ...task,
                progress: 0
            };
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }
                const response = await fetch("/api/getTask", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const fetchedData = await response.json();
                const updatedData = await Promise.all(fetchedData.map(task => calculateProgress(task)));
                setTasksData(updatedData);
            } catch (error) {
                console.error("Ошибка при выполнении запроса:", error);
            }
        };
        fetchData();
    }, []);

    const offset = currentPage * tasksPerPage;
    const currentTasks = tasksData.slice(offset, offset + tasksPerPage);
    const pageCount = Math.ceil(tasksData.length / tasksPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <section className='sectionTask'>
            <div>
                <strong><p className='header-title'>Список задач</p></strong>

                <ul className='task-list'>
                    {currentTasks.map((task) => (
                        <li key={task.id} className='task-item'>
                            <div className='task-item-group'>
                                <h3 className='task-title'>{task.name}</h3>
                                <p>Тип: {task.type}</p>
                                <p>Описание: {task.description}</p>
                                <p>Сумма: {task.amount}</p>
                                <p>Дата создания: {trimDate(task.created_at)}</p>
                                {/* <p>Прогресс: {task.progress.toFixed(2)}%</p> */}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='pagination-container'>
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
        </section>
    );
}
