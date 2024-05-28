import React, { useState, useEffect } from 'react';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory';
import './LineChart.css';

export default function LineChart({ transactions }) {
    const [formattedData, setFormattedData] = useState([]);

    useEffect(() => {
        // Преобразование данных транзакций в формат, подходящий для построения графика
        const data = transactions.map(transaction => ({
            x: new Date(transaction.date), // Дата транзакции по оси X
            y: parseFloat(transaction.sum) // Сумма транзакции по оси Y, преобразуем в число
        }));

        setFormattedData(data);
    }, [transactions]);

    return (
        <section className="sectionGraphicLine">
            <h2>График транзакций</h2>
            <VictoryChart theme={VictoryTheme.material} scale={{ x: "time" }} width={1500} height={400}>
                <VictoryAxis
                    tickFormat={(x) => new Date(x).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={(x) => `${x} руб.`}
                    style={{
                        tickLabels: {
                            angle: -40,
                            textAnchor: 'end',
                            fontSize: 10,
                            padding: 5
                        }
                    }}
                />
                <VictoryLine
                    style={{
                        data: { stroke: "#c43a31" },
                        parent: { border: "1px solid #ccc" }
                    }}
                    data={formattedData}
                    x="x"
                    y="y"
                />
            </VictoryChart>
        </section>
    );
}
