import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function DocSection() {
    const [accountsData, setAccountsData] = useState([]);
    const [transactionsData, setTransactionsData] = useState([]);
    const [tasksData, setTasksData] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        fetchAccountsData();
        fetchTransactionsData();
        fetchTasksData();
    }, []);

    const fetchAccountsData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await fetch("/api/getAccounts", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setAccountsData(data);
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };

    const fetchTransactionsData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await fetch("/api/getTransactions", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setTransactionsData(data);
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };

    const fetchTasksData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await fetch("/api/getTask", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setTasksData(data);
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Отчет по счетам
        doc.text("Отчет по счетам", 14, 20);
        const accountColumns = ["Название счета", "Баланс"];
        const accountRows = accountsData.map(account => [account.name, account.balance]);
        doc.autoTable(accountColumns, accountRows, { startY: 30 });

        // Отчет по транзакциям
        doc.addPage();
        doc.text("Отчет по транзакциям", 14, 20);
        const transactionColumns = ["Дата", "Тип", "Сумма", "Описание"];
        const transactionRows = transactionsData.map(transaction => [
            transaction.date,
            transaction.type,
            transaction.amount,
            transaction.description
        ]);
        doc.autoTable(transactionColumns, transactionRows, { startY: 30 });

        // Отчет с графиками
        doc.addPage();
        doc.text("Отчет с графиками", 14, 20);

        const chartData = {
            labels: transactionsData.map(t => t.date),
            datasets: [
                {
                    label: 'Сумма транзакций',
                    data: transactionsData.map(t => t.amount),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        };

        // Генерация изображения графика и вставка в PDF
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        new ChartJS(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        display: true
                    },
                    title: {
                        display: true,
                        text: 'График транзакций'
                    }
                }
            }
        });

        // Нужно подождать, пока график отрисуется
        setTimeout(() => {
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 14, 30, 180, 100);
            doc.save("full_report.pdf");
        }, 1000);
    };

    return (
        <>
            <div>
                <button onClick={generatePDF}>Скачать полный отчет в PDF</button>
            </div>
            <div>
                <strong><p className='header-title'>Список задач</p></strong>
                <ul className='task-list'>
                    {tasksData.map((task) => (
                        <li key={task.id} className='task-item'>
                            <div className='task-item-group'>
                                <h3 className='task-title'>{task.name}</h3>
                                <p>Тип: {task.type}</p>
                                <p>Описание: {task.description}</p>
                                <p>Сумма: {task.amount}</p>
                                <p>Дата создания: {task.created_at}</p>
                                <p>Прогресс: {typeof task.progress === 'number' ? task.progress.toFixed(2) : '0'}%</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Предпросмотр графика транзакций</h3>
                <Bar
                    data={{
                        labels: transactionsData.map(t => t.date),
                        datasets: [
                            {
                                label: 'Сумма транзакций',
                                data: transactionsData.map(t => t.amount),
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }
                        ]
                    }}
                    options={{
                        plugins: {
                            legend: {
                                display: true
                            },
                            title: {
                                display: true,
                                text: 'График транзакций'
                            }
                        }
                    }}
                    ref={chartRef}
                />
            </div>
        </>
    );
}
