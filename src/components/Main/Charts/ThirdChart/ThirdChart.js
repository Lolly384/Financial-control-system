import React from 'react';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory';
import './ThirdChart.css';

export default function ThirdChart({ transactions }) {
    if (!transactions || transactions.length === 0) {
        return <p>Нет данных для отображения</p>;
    }

    // Группировка данных по категориям и подсчет суммы для каждой категории
    const groupedData = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
            acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.sum;
        return acc;
    }, {});

    // Преобразование сгруппированных данных в формат, подходящий для построения графика
    const chartData = Object.keys(groupedData).map((key) => ({
        x: key,
        y: parseFloat(groupedData[key])
    }));

    // Функция форматирования суммы для подписей на графике
    const formatCurrency = (value) => `${value.toFixed(2)} руб.`;

    return (
        <section className="sectionGraphicThird">
            <h2>Распределение расходов по категориям</h2>
            <div className="victory-container">
                <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={20}
                    width={1500} // Ширина графика
                    height={400} // Высота графика
                    className="victory-container"
                >
                    <VictoryAxis
                        style={{ tickLabels: { angle: -25, fontSize: 10, padding: 15, fill: 'white' } }} // Поворот меток оси X для лучшей читаемости
                    />
                    <VictoryAxis
                        dependentAxis
                        style={{ tickLabels: { fontSize: 8, angle: -45, fill: 'white' } }}
                        tickFormat={(x) => formatCurrency(x)}
                    />
                    <VictoryBar
                        style={{
                            data: { fill: "#c43a31" },
                            labels: { fill: "white" }
                        }}
                        data={chartData}
                        x="x"
                        y="y"
                        labels={({ datum }) => formatCurrency(datum.y)}
                        barWidth={20}
                    />
                </VictoryChart>
            </div>
        </section>
    );
}
