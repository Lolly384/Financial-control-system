import img from './icons8-card-100.png';
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import './SectionBalance.css';

export default function SectionBalance() {
    const [accounts, setAccounts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const accountsPerPage = 1;  // Устанавливаем количество счетов на странице

    const fetchAccounts = async () => {
        try {
            const response = await fetch('/api/getAccounts');
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    // Get current accounts
    const offset = currentPage * accountsPerPage;
    const currentAccounts = accounts.slice(offset, offset + accountsPerPage);
    const pageCount = Math.ceil(accounts.length / accountsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <section className='sectionBalance'>
            <div className='accounts'>
                {currentAccounts.map((account) => (
                    <div key={account.id} className='account'>
                        <div className='accountItem-imgAndName'>
                            <img src={img} alt="Account Icon" />
                            <strong><p>{account.name}</p></strong>
                        </div>
                        <p>Баланс: {account.balance}</p>
                    </div>
                ))}
            </div>
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
        </section>
    );
}
