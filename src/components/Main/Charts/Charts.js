import React, { useState, useEffect } from 'react';
import { VictoryPie } from 'victory';
import Button from '../../Button/Button';
import FirstChart from './FirstChart/FirstChart';
import './Charts.css';
import SecondChart from './SecondChart/SecondChart';
import ThirdChart from './ThirdChart/ThirdChart';
import LineChart from './LineChart/LineChart';
import CoolChartTransaction from './CoolChartTransaction/CoolChartTransaction';
import iconRows from './free-icon-rows-9726555.png';
import iconTable from './free-icon-table-966370.png';
import iconSlider from './free-icon-slider-12067485.png';

const trimDate = (longDate) => {
    const date = new Date(longDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

export default function Charts() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const initialStartDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(currentYear, currentMonth, 0).getDate();
    const initialEndDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDay}`;

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [transactions, setTransactions] = useState([]);
    const [showChart, setShowChart] = useState(false); // Добавляем состояние для отображения графика
    const [accounts, setAccounts] = useState([]);
    const [layout, setLayout] = useState('single'); // Состояние для отслеживания текущего расположения графиков
    const [currentPage, setCurrentPage] = useState(0); // Состояние для отслеживания текущей страницы в слайдере

    const chartsPerPage = 1; // Количество графиков на одной странице

    const getTransactions = async (start, end) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            console.log('Sending dates:', start, end); // Логируем отправляемые даты
            // Формируем URL с параметрами startDate и endDate
            const url = `/api/getTransactionsDate?startDate=${start}&endDate=${end}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                const errorText = await response.text(); // Получаем текст ошибки с сервера
                throw new Error(`Failed to fetch transactions: ${errorText}`);
            }
            const fetchedData = await response.json();
            setTransactions(fetchedData);
            setShowChart(true); // Устанавливаем состояние для отображения графика после получения данных
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };

    const getAccounts = async () => {
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

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowChart(false); // Скрываем график перед отправкой запроса
        getTransactions(startDate, endDate);
        getAccounts();
    };

    const handleSingleLayout = () => {
        setLayout('single');
    };

    const handleDoubleLayout = () => {
        setLayout('double');
    };

    const handleSliderLayout = () => {
        setLayout('slider');
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const charts = [
        <div className='grop-graphics'>
            <SecondChart accounts={accounts} />
            <CoolChartTransaction transactions={transactions} />
        </div>,
        <FirstChart transactions={transactions} key="FirstChart" />,
        <ThirdChart transactions={transactions} key="ThirdChart" />,
        <LineChart transactions={transactions} key="LineChart" />,
    ];

    const paginatedCharts = charts.slice(currentPage * chartsPerPage, (currentPage + 1) * chartsPerPage);

    return (
        <div className="charts-container">
            <form onSubmit={handleSubmit}>
                <div className="menu">
                    <div className='menu-input'>
                        <label>
                            От:
                            <input
                                type="date"
                                name="startDate"
                                value={startDate}
                                onChange={handleStartDateChange}
                                required
                            />
                        </label>
                        <label>
                            До:
                            <input
                                type="date"
                                name="endDate"
                                value={endDate}
                                onChange={handleEndDateChange}
                                required
                            />
                        </label>
                        <Button type="submit">Показать</Button>
                    </div>
                    <div className="layout-buttons">
                        <Button isActive={layout === 'single'} onClick={handleSingleLayout}><img src={iconRows} alt='В ряд' /></Button>
                        {/* <Button isActive={layout === 'double'} onClick={handleDoubleLayout}><img src={iconTable} alt='2 В ряд' /></Button> */}
                        <Button isActive={layout === 'slider'} onClick={handleSliderLayout}><img src={iconSlider} alt='Слайдер' /></Button>
                    </div>
                </div>
                {showChart && (
                    <div className='charts'>
                        {layout === 'single' && (
                            <div className='single-layout'>
                                <div className='grop-graphics'>
                                    <SecondChart accounts={accounts} />
                                    <CoolChartTransaction transactions={transactions} />
                                </div>
                                <FirstChart transactions={transactions} />
                                <ThirdChart transactions={transactions} />
                                <LineChart transactions={transactions} />
                            </div>
                        )}
                        {/* {layout === 'double' && (
                            <div className='double-layout'>
                                <FirstChart transactions={transactions} />
                                <SecondChart accounts={accounts} />
                            </div>
                        )} */}
                        {layout === 'slider' && (
                            <div className='slider-layout'>
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
                                {paginatedCharts}
                                <div className="pagination-controls">
                                    <button onClick={handlePreviousPage} disabled={currentPage === 0}><i className="fas fa-chevron-left"></i></button>
                                    <button onClick={handleNextPage} disabled={(currentPage + 1) * chartsPerPage >= charts.length}><i className="fas fa-chevron-right"></i></button>
                                </div>
                                

                            </div>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}
