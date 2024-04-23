import React, { useState } from 'react';
import './Tasks.css';
import Button from '../Button/Button';
import ReactPaginate from 'react-paginate';

export default function Tasks() {
    const [currentPage, setCurrentPage] = useState(0); // текущая страница пагинации
    const itemsPerPage = 1; // количество элементов на странице
    const totalItems = 30; // общее количество элементов

    const pageCount = Math.ceil(totalItems / itemsPerPage); // количество страниц

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Генерация элементов для текущей страницы
    const currentPageItems = [];
    for (let index = currentPage * itemsPerPage; index < Math.min((currentPage + 1) * itemsPerPage, totalItems); index++) {
        currentPageItems.push(
            <div className='tasks-task' key={index}>
                <h2>Задача {index+1}: Создание пагинации для страницы транзакций</h2>
                <div className="task-description">
                    <h3>Описание:</h3>
                    <p>
                        Добавить пагинацию к разделу транзакций на странице.
                        Пагинация должна быть выровнена по центру страницы и растянута на всю ее ширину.
                        Клик по номерам страниц должен вызывать соответствующие изменения на странице транзакций, отображая соответствующие данные.
                    </p>
                </div>
                <div className="task-steps">
                    <h3>Требования</h3>
                    <ol>
                        <li>Используя библиотеку React Paginate, добавьте пагинацию к компоненту Transactions.</li>
                        <li>Настройте количество отображаемых страниц и отступы между ними в соответствии с дизайном.</li>
                        <li>Добавьте обработчик событий для кликов по страницам, который будет обновлять текущую страницу транзакций.</li>
                        <li>Протестируйте пагинацию, убедившись, что она работает корректно и отображает правильные данные.</li>
                        

                    </ol>
                </div>
                <div className="additional-requirements">
                    <h3>Дополнительные требования:</h3>
                    <ul>
                        <li>Пагинация должна быть стилизована в соответствии с дизайном приложения.</li>
                        <li>Проверьте, что пагинация не позволяет выделять текст на странице.</li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <section className='tasks'>
            <div className='tasks-butGroup'>
                <Button>Добавить</Button>
                <Button>Удалить</Button>
            </div>
            {currentPageItems}
            {/* ------------- */}
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
        </section>
    );
}
