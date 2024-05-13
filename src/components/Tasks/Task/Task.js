import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

export default function Task() {
    const [data, setData] = useState([]);

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

    const [currentPage, setCurrentPage] = useState(0); // текущая страница пагинации
    const itemsPerPage = 1; // количество элементов на странице
    const totalItems = data.length; // общее количество элементов
    const pageCount = Math.ceil(totalItems / itemsPerPage); // количество страниц

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Генерация элементов для текущей страницы
    const currentPageItems = data
        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        .map((task, index) => (
            <div className='tasks-task' key={data.id}>
                <h2>Задача {task.id}: {task.name}</h2>
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
        ));

    return (
        <>
            {currentPageItems}
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
