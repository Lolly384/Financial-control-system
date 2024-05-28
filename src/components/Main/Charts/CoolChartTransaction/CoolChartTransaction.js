import React, { useState } from 'react';
import { VictoryPie } from 'victory';
import './CoolChartTransaction.css';

export default function CoolChartTransaction({ transactions }) {
    // Используем состояние для отслеживания общей суммы расходов и доходов
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);

    // Проверяем наличие данных транзакций и вычисляем суммы только один раз при первом рендеринге
    if (transactions && transactions.length > 0 && totalExpense === 0 && totalIncome === 0) {
        transactions.forEach(transaction => {
            const amount = parseFloat(transaction.sum);
            switch (transaction.type) {
                case 'Пополнение':
                case 'Зачисление':
                case 'Возврат':
                case 'Пополнение счета':
                    setTotalIncome(prevIncome => prevIncome + amount);
                    break;
                case 'Снятие':
                case 'Перевод':
                case 'Платеж':
                case 'Списание':
                case 'Комиссии':
                case 'Снятие наличных':
                case 'Перевод на карту':
                case 'Оплата услуг':
                    setTotalExpense(prevExpense => prevExpense + amount);
                    break;
                default:
                    break;
            }
        });
    }

    // Создаем данные для круговой диаграммы
    const chartData = [
        { x: 'Потрачено', y: totalExpense },
        { x: 'Пополнено', y: totalIncome }
    ];

    // Проверяем наличие данных транзакций
    if (!transactions || transactions.length === 0) {
        return <p>Нет данных для отображения</p>;
    }

    return (
        <div style={{ width: '50%', textAlign: 'center', }}>
            <h2 style={{ marginBottom: '20px' }}>Потраченные и пополненные средства</h2>
            <svg viewBox="0 0 600 600" style={{ maxWidth: '100%', maxHeight: '300px', margin: 'auto' }}>
                <VictoryPie
                    standalone={false}
                    width={600}
                    height={600}
                    padding={50}
                    innerRadius={70}
                    data={chartData}
                    colorScale={["tomato", "green"]}
                    labels={({ datum }) => `${datum.x}: ${datum.y.toFixed(2)} руб.`}
                    labelRadius={100}
                    style={{ labels: { fill: "black", fontSize: 25, fontWeight: "bold" } }}
                />
            </svg>
        </div>
    );
}
