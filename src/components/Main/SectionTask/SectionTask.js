import './SectionTask.css';
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

export default function SectionTask() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const tasksPerPage = 1;

    const getTask = async () => {
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
            setData(fetchedData);
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };

    useEffect(() => {
        getTask();
    }, []);

    const offset = currentPage * tasksPerPage;
    const currentTasks = data.slice(offset, offset + tasksPerPage);
    const pageCount = Math.ceil(data.length / tasksPerPage);

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
                                <p>Описание:
                                    <p className='task-description-sectiontask'>{task.description}</p>
                                </p>
                                <p>Требования:
                                    <p className='task-description-sectiontask'>{task.requirements}</p>
                                </p>
                                <p>Доп. требования:
                                    <p className='task-description-sectiontask'>{task.additionalreq}</p>
                                </p>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
                <ReactPaginate
                    pageCount={pageCount}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    previousLabel={<i className="fas fa-chevron-left"></i>} // Иконка стрелки влево
                    nextLabel={<i className="fas fa-chevron-right"></i>} // Иконка стрелки вправо
                    breakLabel={"..."}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    pageClassName="page-item"
                />
        </section>
    );
}
