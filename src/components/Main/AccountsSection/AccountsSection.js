import React, { useState, useEffect } from 'react';
import Button from "../../Button/Button";
import FormAddTransaction from '../../Transactions/FornAddTransaction/FormAddTransaction';
import img from './icons8-card-100.png';
import Modal from 'react-modal';
import './AccountsSection.css';
import addIcon from './free-icon-add-square-outlined-interface-button-54731.png';
import iconPDF from './icons8-pdf-50.png';

export default function AccountsSection() {
    const [accounts, setAccounts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({ name: '', balance: '' });
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [selectedAccountForTransaction, setSelectedAccountForTransaction] = useState(null); // Состояние для хранения выбранного счета

    const fetchAccounts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        try {
            const response = await fetch('/api/getAccounts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch accounts');
            }
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleDeleteAccount = async (row) => {
        try {
            const response = await fetch('api/deleteAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(row)
            });
            if (response.ok) {
                console.log('Account deleted successfully');
                // Обновляем данные счетов после успешного удаления
                await fetchAccounts();
            } else {
                throw new Error('Failed to delete Account');
            }
        } catch (error) {
            console.error('Error deleting Account:', error);
        }
    };

    const handleCreateAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/addAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAccount)
            });

            if (response.ok) {
                const createdAccount = await response.json();
                setAccounts([...accounts, createdAccount]);
                setIsModalOpen(false);
                setNewAccount({ name: '', balance: '' });
            } else {
                console.error('Error creating account');
            }
        } catch (error) {
            console.error('Error creating account:', error);
        }
    };

    const handleTransactionAdded = async () => {
        setIsTransactionModalOpen(false);
        // Обновить таблицу после добавления транзакции
        await fetchAccounts();
    };

    return (
        <div className="accountsSection">
            <div className="accountsSection-butMenu">
                <Button onClick={() => setIsModalOpen(true)}><img className='icon' src={addIcon} alt='Создать' /></Button>
                {/* <Button ><img className='icon' src={iconPDF} alt='PDF' /></Button> */}
            </div>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Создать новый счет</h2>
                        <input
                            type="text"
                            placeholder="Имя счета"
                            value={newAccount.name}
                            onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Начальный баланс"
                            value={newAccount.balance}
                            onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
                        />
                        <div className='modal-content-butGroup'>
                            <button className="modal-button" onClick={handleCreateAccount}>Создать</button>
                            <button className="modal-button" onClick={() => setIsModalOpen(false)}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="accountsList">
                {accounts.map((account, index) => (
                    <div key={account.id} className="accountItem">
                        <div className='accountItem-imgAndName'>
                            <img src={img} alt='Account Icon' />
                            <strong><p className='accountItem-name'>{account.name}</p></strong>
                        </div>
                        <p>Баланс: {account.balance}</p>
                        <div className='accountsList-groupBut'>
                            <Button onClick={() => {
                                setIsTransactionModalOpen(true);
                                setSelectedAccountForTransaction(account.name); // Передаем название счета в состояние
                            }}>Транзакция</Button>
                            <Button onClick={() => handleDeleteAccount(account)}>Удалить</Button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isTransactionModalOpen} onRequestClose={() => setIsTransactionModalOpen(false)}>
                <FormAddTransaction 
                    onTransactionAdded={handleTransactionAdded} 
                    selectedAccount={selectedAccountForTransaction} 
                    fetchAccounts={fetchAccounts} 
                />
            </Modal>
        </div>
    );
}
