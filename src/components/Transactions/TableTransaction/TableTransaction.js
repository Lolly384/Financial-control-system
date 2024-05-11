import React, { useState, useEffect } from 'react';
import '../Transactions.css';
import Button from '../../Button/Button';
import ReactPaginate from 'react-paginate';


const trimDate = (longDate) => {
    const date = new Date(longDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

export default function TableTransaction() {
    const [currentPage, setCurrentPage] = useState(0);
    const [data, setData] = useState([]);
    const itemsPerPage = 10; // Количество элементов на странице

    const getTransactions = async () => {
        try {
            const response = await fetch("/api/getTransactions");
            const fetchedData = await response.json();
            setData(fetchedData);
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };

    useEffect(() => {
        getTransactions();
    }, []);

    const pageCount = Math.ceil(data.length / itemsPerPage);

    const handlePageClick = ({ selected }) => {
        console.log (selected)
        setCurrentPage(selected);
    };

    const startItem = currentPage * itemsPerPage;
    const endItem = (currentPage + 1) * itemsPerPage;
    const currentRows = data.slice(startItem, endItem);

    return (
        <>
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
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((row, index) => (
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{row.type}</td>
                            <td>{row.sum}</td>
                            <td>{trimDate(row.date)}</td>
                            <td>{row.category}</td>
                            <td>{row.description}</td>
                            <td>{row.recipient}</td>
                            <td>{row.sender}</td>
                            <td>{row.status}</td>
                            <td>{row.accounts}</td>
                            <td><Button>Изменить</Button></td>
                            <td><Button>Удалить</Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='transactions-button'>
                <ReactPaginate
                    pageCount={pageCount}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    previousLabel={"Пред."}
                    nextLabel={"След."}
                    breakLabel={"..."}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    pageClassName="page-item"
                />
            </div>
        </>
    )
}
