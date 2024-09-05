import './SectionStatistic.css';
import React, { useState, useEffect, useMemo } from 'react';

const incomeTypes = [
    'Пополнение', 'Зачисление', 'Возврат', 'Пополнение счета'
];

const expenseTypes = [
    'Снятие', 'Перевод', 'Платеж', 'Списание', 'Комиссии', 'Снятие наличных', 'Перевод на карту', 'Оплата услуг'
];

const SectionStatistic = () => {
    const [data, setData] = useState([]);

    

    const getTransactions = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        try {
            const response = await fetch("/api/getTransactionsCurrentMonth", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }
            const fetchedData = await response.json();
            console.log('Fetched transactions:', fetchedData); // Проверяем данные
            setData(fetchedData);
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };

    useEffect(() => {
        getTransactions();
    }, []);

    const statistics = useMemo(() => {
        if (data.length === 0) return {
            maxSpent: 0,
            maxReplenished: 0,
            totalSpent: 0,
            totalReplenished: 0
        };

        const expenses = data.filter(t => expenseTypes.includes(t.type)).map(t => parseFloat(t.sum));
        const incomes = data.filter(t => incomeTypes.includes(t.type)).map(t => parseFloat(t.sum));

        console.log('Expenses:', expenses); // Логируем расходы
        console.log('Incomes:', incomes); // Логируем доходы

        const maxSpent = expenses.length > 0 ? Math.max(...expenses) : 0;
        const maxReplenished = incomes.length > 0 ? Math.max(...incomes) : 0;

        const totalSpent = expenses.reduce((sum, amount) => sum + amount, 0);
        const totalReplenished = incomes.reduce((sum, amount) => sum + amount, 0);

        return {
            maxSpent,
            maxReplenished,
            totalSpent,
            totalReplenished
        };
    }, [data]);

    return (
        <section className='sectionStatistic'>
            <div className="statistics-section">
                <h3>Статистика за месяц</h3>
                <p>Макс. сумма потраченная за раз: <span>{statistics.maxSpent} ₽</span></p>
                <p>Макс. сумма пополнения за раз: <span>{statistics.maxReplenished} ₽</span></p>
                <p>Общая сумма потраченная: <span>{statistics.totalSpent} ₽</span></p>
                <p>Общая сумма пополнений: <span>{statistics.totalReplenished} ₽</span></p>
            </div>
        </section>
    );
};

export default SectionStatistic;
