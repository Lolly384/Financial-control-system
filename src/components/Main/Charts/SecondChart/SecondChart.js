import React from 'react';
import { VictoryPie } from 'victory';

export default function SecondChart({ accounts }) {
    // Проверка наличия данных
    if (!accounts || accounts.length === 0) {
        return <p>Нет данных для отображения</p>;
    }

    // Преобразование данных счетов для отображения в круговом графике
    const chartData = accounts.map(account => ({
        x: account.name, // Имя счета
        y: account.balance // Сумма счета
    }));

    return (
        <div  style={{ width: '50%', textAlign: 'center',  }}>
            <h2 style={{ marginBottom: '20px' }}>Денег на счетах</h2>
            <svg viewBox="0 0 600 600" style={{ maxWidth: '100%', maxHeight: '300px', margin: 'auto' }}>
                <VictoryPie
                    standalone={false}
                    width={600}
                    height={600}
                    padding={50}
                    innerRadius={40}
                    data={chartData}
                    colorScale={["#008000", "#FF6347", "#330066", "#663300" ]} // Изменяем палитру цветов
                    labels={({ datum }) => `${datum.x}: ${datum.y} ₽`}
                    labelRadius={50}
                    style={{ labels: { fontSize: 25, fill: 'white' } }}
                />
            </svg>
        </div>
    );
}
