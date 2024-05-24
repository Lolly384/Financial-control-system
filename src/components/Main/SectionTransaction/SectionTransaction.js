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
            <ReactPaginate
                pageCount={pageCount}
                pageRangeDisplayed={1}
                marginPagesDisplayed={1}
                previousLabel={"Пред."}
                nextLabel={"След."}
                breakLabel={"..."}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                pageClassName={"page-item"}
            />
        </section>
    );
}
