import React, { useState, useEffect } from 'react';
import Button from "../../Button/Button";
import FormAddTransaction from '../../Transactions/FornAddTransaction/FormAddTransaction';
import './AccountsSection.css';

export default function AccountsSection() {
    const [accounts, setAccounts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({ name: '', balance: '' });
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [transactionType, setTransactionType] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch('/api/getAccounts');
                const data = await response.json();
                setAccounts(data);
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        fetchAccounts();
    }, []);

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

    const handleTransactionSuccess = (updatedAccount) => {
        setAccounts(accounts.map(account => 
            account.id === updatedAccount.id ? updatedAccount : account
        ));
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
            {isTransactionModalOpen && (
                <FormAddTransaction
                    accountId={selectedAccount}
                    transactionType={transactionType}
                    onClose={() => setIsTransactionModalOpen(false)}
                    onTransactionSuccess={handleTransactionSuccess}
                />
            )}
            <div className="accountsList">
                {accounts.map(account => (
                    <div key={account.id} className="accountItem">
                        <strong><p className='accountItem-name'>{account.name}</p></strong>
                        <p>Баланс: {account.balance}</p>
                        <div className='accountsList-groupBut'>
                            <Button onClick={() => { setSelectedAccount(account.id); setTransactionType('deposit'); setIsTransactionModalOpen(true); }}>Пополнить</Button>
                            <Button onClick={() => { setSelectedAccount(account.id); setTransactionType('withdraw'); setIsTransactionModalOpen(true); }}>Снять</Button>
                            <Button>Удалить</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
