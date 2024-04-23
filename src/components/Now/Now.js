import './Now.css'
import moment from 'moment'; // Для современных браузеров
import { useState, useEffect } from 'react'; // Добавлено useEffect для управления интервалом

export default function Now({ contentType }) {
    const [time, setTime] = useState(moment().format('HH:mm:ss')); // Инициализация текущего времени
    const [date, setDate] = useState(moment().format('DD MMMM YYYY')); // Инициализация текущей даты

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(moment().format('HH:mm:ss')); // Обновление текущего времени
            setDate(moment().format('DD MMMM YYYY')); // Обновление текущей даты
        }, 1000); // Интервал обновления в миллисекундах (1000 миллисекунд = 1 секунда)

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(intervalId);
    }, []); // Пустой массив зависимостей означает, что useEffect будет вызван только после первого рендера

    return (
        <div className='App-main-contents-group'>
            <div className='App-main-contents-group-date'>
                <h1><strong>{contentType}</strong></h1>
                <p>Сегодня {date}</p>
            </div>
            <div className='App-main-contents-group-time'>
                <p>Время: {time}</p>
            </div>
        </div>
    )
}