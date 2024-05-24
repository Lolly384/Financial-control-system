import React, { useState, useEffect } from 'react';
import Button from "../../Button/Button";
import FormAddTransaction from '../../Transactions/FornAddTransaction/FormAddTransaction';
import img from './icons8-card-100.png'
import Modal from 'react-modal';
import './AccountsSection.css';

export default function AccountsSection() {
    const [accounts, setAccounts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({ name: '', balance: '' });
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [transactionType, setTransactionType] = useState('');
    const [selectedAccountForTransaction, setSelectedAccountForTransaction] = useState(null); // Состояние для хранения выбранного счета

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

    const handleDeleteAccount = async (row) => {
        try {
            const response = await fetch('api/deleteAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
        // Закрыть модальное окно после добавления транзакции
        setIsTransactionModalOpen(false);
        // Обновить таблицу после добавления транзакции
        // Установить флаг изменения данных таблицы
        // setTableDataChanged(true);
    };

    return (
        <div className="accountsSection">
            <div className="accountsSection-butMenu">
                <Button onClick={() => setIsModalOpen(true)}>Создать</Button>
            </div>
            {isModalOpen && (
                <div className="modal">
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
                            <Button onClick={handleCreateAccount}>Создать</Button>
                            <Button onClick={() => setIsModalOpen(false)}>Отмена</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="accountsList">
                {accounts.map((account, index) => (
                    <div key={account.id} className="accountItem">
                        <div className='accountItem-imgAndName'>
                            <img src={img}></img>
                            <strong><p className='accountItem-name'>{account.name}</p></strong>
                        </div>
                        <p>Баланс: {account.balance}</p>
                        <div className='accountsList-groupBut'>
                            <Button onClick={() => {
                                setIsTransactionModalOpen(true);
                                setSelectedAccountForTransaction(account.name); // Передаем название счета в состояние
                            }}>Транзакция</Button>
                            <Modal isOpen={isTransactionModalOpen} onRequestClose={() => setIsTransactionModalOpen(false)}>
                                <FormAddTransaction onTransactionAdded={handleTransactionAdded} selectedAccount={selectedAccountForTransaction} fetchAccounts={fetchAccounts} /> 
                                
                            </Modal>
                            <Button onClick={() => handleDeleteAccount(account)}>Удалить</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
