import './Main.css'
import Button from '../Button/Button'
import SectionBalance from './SectionBalance/SectionBalance'
import SectionGraphic from './SectionGraphic/SectionGraphic'
import Transactions from '../Transactions/Transactions'
import Calculators from '../SectionCalculators/SectionCalculators'
import Tasks from '../Tasks/Tasks'
import Now from '../Now/Now'
import { useState, useEffect } from 'react'
import AccountsSection from './AccountsSection/AccountsSection'
import SectionTransactuin from './SectionTransaction/SectionTransaction'
import SectionTask from './SectionTask/SectionTask'
import SectionStatistic from './SectionStatistic/SectionStatistic'
import Charts from './Charts/Charts'
import DocSection from './DocSection/DocSection'


export default function Main() {

    const [contentType, setContentType] = useState('Обзор');
    let menuArr = ['Обзор', 'Счета', 'Транзакции', 'Задачи', 'Графики']


    function handleClick(type) {
        console.log("button cliked", type)
        setContentType(type)
    }

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
                            <div className='Group-monyBaner'>
                                <SectionBalance />
                                <SectionStatistic />
                            </div>
                            <SectionTransactuin />
                            <SectionTask />
                        </div>
                        <SectionGraphic />
                    </>
                )}

                {contentType === 'Счета' && (
                    <>
                        <Now contentType={contentType}></Now>
                        <AccountsSection />
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

                {contentType === 'Графики' && (
                    <>
                        <Now contentType={contentType}></Now>
                        <Charts />
                    </>
                )}

                {/* {contentType === 'Калькуляторы' && (
                    <>
                        <Calculators />
                    </>
                )} */}

                {/* {contentType === 'Отчёты' && (
                    <>
                        <Now contentType={contentType}></Now>
                        <DocSection />
                    </>
                )} */}

            </section>
        </main>
    )
}