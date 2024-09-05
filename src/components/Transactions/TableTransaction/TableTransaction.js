import React, { useState, useEffect } from 'react';
import '../Transactions.css';
import Button from '../../Button/Button';
import ReactPaginate from 'react-paginate';
import FormChangeTransaction from '../FormChangeTransaction/FormChangeTransaction';
import Modal from 'react-modal';
import './TableTransaction.css';
import imgDelete from './free-icon-delete-1214428.png';
import imgEdit from './free-icon-edit-1159633.png';

const trimDate = (longDate) => {
    const date = new Date(longDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
};

export default function TableTransaction({ tableDataChanged, setTableDataChanged }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [data, setData] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState({});
    const itemsPerPage = 8; // Количество элементов на странице

    const getTransactions = async () => {
        try {
            const response = await fetch("/api/getTransactions", {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const fetchedData = await response.json();
            if (Array.isArray(fetchedData)) {
                setData(fetchedData);
            } else {
                console.error("Fetched data is not an array:", fetchedData);
                setData([]);
            }
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };

    useEffect(() => {
        getTransactions();
    }, [tableDataChanged]);

    const pageCount = Math.ceil(data.length / itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleDelete = async (row) => {
        try {
            const response = await fetch('api/deleteTransaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(row)
            });
            if (response.ok) {
                console.log('Transaction deleted successfully');
                // Обновляем данные транзакций после успешного удаления
                await getTransactions();
            } else {
                throw new Error('Failed to delete transaction');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handleTransactionChange = async () => {
        // Обновляем данные транзакций
        await getTransactions();
        // Закрываем все модальные окна
        setModalIsOpen({});
    };

    const openModal = (index) => {
        setModalIsOpen({ ...modalIsOpen, [index]: true });
    };

    const closeModal = () => {
        setModalIsOpen({});
    };

    const startItem = currentPage * itemsPerPage;
    const endItem = (currentPage + 1) * itemsPerPage;
    const currentRows = Array.isArray(data) ? data.slice(startItem, endItem) : [];

    return (
        <>
            <table className='transactions-table' border="1">
                <thead>
                    <tr>
                        <th>Тип операции</th>
                        <th>Сумма</th>
                        <th>Дата</th>
                        <th>Категория</th>
                        <th>Описание</th>
                        <th>Счет</th>
                        <th>Отправитель</th>
                        <th>Получатель</th>
                        <th>Статус</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.type}</td>
                            <td>{row.sum}</td>
                            <td>{trimDate(row.date)}</td>
                            <td>{row.category}</td>
                            <td>{row.description}</td>
                            <td>{row.accounts}</td>
                            <td>{row.sender}</td>
                            <td>{row.recipient}</td>
                            <td>{row.status}</td>
                            <td className="button-group">
                                <Button onClick={() => openModal(index)}><img className='icon' src={imgEdit} alt='Редактировать' /></Button>
                                <Modal isOpen={modalIsOpen[index]} onRequestClose={closeModal}>
                                    <FormChangeTransaction transaction={row} onTransactionChange={handleTransactionChange} />
                                </Modal>
                                <Button onClick={() => handleDelete(row)}><img className='icon' src={imgDelete} alt='Удалить' /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='transactions-button'>
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
            </div>
        </>
    );
}
