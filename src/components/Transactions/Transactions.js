import React, { useState } from 'react';
import './Transactions.css';
import Button from '../Button/Button';
import ReactPaginate from 'react-paginate';

export default function Transactions() {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const totalRows = [];
    for (let index = 0; index < 2000; index++) {
        totalRows.push(
            <tr key={index}>
                <td>{index}</td>
                <td>??</td>
                <td>??</td>
                <td>??</td>
                <td>??</td>
                <td>??</td>
                <td>??</td>
                <td>??</td>
                <td>??</td>
                <td>??</td>
                <td>??</td>
                <td><Button>Изменить</Button></td>
            </tr>
        );
    }

    const pageCount = Math.ceil(totalRows.length / itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const startItem = currentPage * itemsPerPage;
    const endItem = startItem + itemsPerPage;
    const currentRows = totalRows.slice(startItem, endItem);

    return (
        <section className="transactions">
            <div className='transactions-butGroup'>
                <Button>Добавить</Button>
                <Button>Удалить</Button>
            </div>
            <table className='transactions-table' border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Тип операции</th>
                        <th>Сумма</th>
                        <th>Дата</th>
                        <th>Категория</th>
                        <th>Описание</th>
                        <th>Счет</th>
                        <th>Получатель</th>
                        <th>Отправитель</th>
                        <th>Статус</th>
                        <th>Счет</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows}
                </tbody>
            </table>
            <div className='transactions-button'>
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
