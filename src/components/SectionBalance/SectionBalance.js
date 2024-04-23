import img from './icons8-card-100.png'
import gif from './icons8-card (1).gif'

import './SectionBalance.css'

let balance = 1250.25

export default function SectionBalance() {
    return (
        <section className='sectionBalance'>
            <div className='group'>
                <img src={img}></img>
                <p>Баланс: {balance} $</p>
            </div>
        </section>
    )
}