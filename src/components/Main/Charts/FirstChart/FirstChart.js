import React, { useState, useEffect } from 'react';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory';
import './FirstChart.css'


export default function FirstChart({ transactions }) {
    // Группировка данных по типу операций и подсчет суммы для каждого типа
    const groupedData = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.type]) {
            acc[transaction.type] = 0;
        }
        acc[transaction.type] += transaction.sum;
        return acc;
    }, {});

    // Преобразование сгруппированных данных в формат, подходящий для построения графика
    const chartData = Object.keys(groupedData).map((key) => ({
        x: key,
        y: parseFloat(groupedData[key])
    }));

    return (
        <section className="sectionGraphicFirst">
            <h2>Распределение расходов по типам операций</h2>
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
                        style={{ tickLabels: { angle: -45, fontSize: 10, fill: "white" }, axisLabel: { fill: "white" } }}
                        tickFormat={(x) => `${x} ₽`}
                    />
                    <VictoryBar
                        style={{
                            data: { fill: "#c43a31" },
                            labels: { fill: "white" }
                        }}
                        data={chartData}
                        x="x"
                        y="y"
                        labels={({ datum }) => `${datum.y.toFixed(2)} руб.`}
                        barWidth={20}
                    />
                </VictoryChart>
            </div>
        </section>
    );
}