import './Main.css'
import Button from '../Button/Button'
import SectionBalance from '../SectionBalance/SectionBalance'
import SectionGraphic from '../SectionGraphic/SectionGraphic'
import Transactions from '../Transactions/Transactions'
import Tasks from '../Tasks/Tasks'
import Now from '../Now/Now'
import { useState, useEffect } from 'react'


export default function Main() {

    const [contentType, setContentType] = useState('Обзор');
    let menuArr = ['Обзор', 'Счета', 'Транзакции', 'Задачи', 'Бюджетирование', 'Калькуляторы', 'Отчёты']

    function handleClick(type) {
        console.log("button cliked", type)
        setContentType(type)
    }

    // main.js
    // const testRequest = async () => {
    //     try {
    //         const response = await fetch("/api/getTransactions");
    //         const data = await response.json(); // Ждем разрешения промиса
    //         console.log(data); // Выводим данные, а не промис
    //     } catch (error) {
    //         console.error("Ошибка при выполнении запроса:", error);
    //     }
    // };

    // useEffect(() => {
    //     testRequest();
    // }, []);


    return (
        <main className='App-main'>
            <section className='App-main-menu'>
                {
                    menuArr.map((elem, index) => (
                        <Button isActive={contentType === elem} onClick={() => handleClick(elem)} key={index}>
                            {elem}
                        </Button>
                    ))
                }
            </section>
            <section className='App-main-contents'>
                {contentType === 'Обзор' && (
                    <>
                        <Now contentType={contentType}></Now>
                        <div className='App-main-contents-sectionGroup'>
                            <SectionBalance />
                            <SectionBalance />
                            <SectionBalance />

                        </div>
                        <SectionGraphic />
                    </>
                )}

                {contentType === 'Счета' && (
                    <>
                        <Now contentType={contentType}></Now>
                    </>
                )}

                {contentType === 'Транзакции' && (
                    <>
                        <Now contentType={contentType}></Now>
                        <Transactions />
                    </>
                )}

                {contentType === 'Задачи' && (
                    <>
                        <Now contentType={contentType}></Now>
                        <Tasks />
                    </>
                )}

                {contentType === 'Бюджетирование' && (
                    <>
                        <Now contentType={contentType}></Now>
                    </>
                )}

                {contentType === 'Калькуляторы' && (
                    <>
                        <Now contentType={contentType}></Now>
                    </>
                )}

                {contentType === 'Отчёты' && (
                    <>
                        <Now contentType={contentType}></Now>
                    </>
                )}

            </section>
        </main>
    )
}