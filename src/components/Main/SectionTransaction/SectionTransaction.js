import './SectionTransaction.css';
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

const trimDate = (longDate) => {
    const date = new Date(longDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

export default function SectionTransaction() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const transactionsPerPage = 5;

    const getTransactions = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        try {
            const response = await fetch("/api/getTransactions", {
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
        getTransactions();
    }, []);

    const offset = currentPage * transactionsPerPage;
    const currentTransactions = data.slice(offset, offset + transactionsPerPage);
    const pageCount = Math.ceil(data.length / transactionsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <section className='sectionTransaction'>
            <div>
                <strong><p className='header-name'>Список транзакций</p></strong>

                {currentTransactions.map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                        <span className="transaction-date">{trimDate(transaction.date)}</span> |
                        <span className="transaction-type"> {transaction.type}</span> |
                        <span className="transaction-sum"> {transaction.sum} $</span>
                    </div>
                ))}
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
