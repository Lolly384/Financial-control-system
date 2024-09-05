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
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await fetch('/api/getAccounts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch accounts');
            }
            const accounts = await response.json();
            setAccounts(accounts);
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
                        <p>Баланс: {account.balance} ₽</p>
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
