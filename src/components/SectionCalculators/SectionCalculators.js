
// import React, { useState } from 'react';
// import axios from 'axios';

// export default function SectionCalculators(){
//     const [amount, setAmount] = useState('');
//     const [fromCurrency, setFromCurrency] = useState('');
//     const [toCurrency, setToCurrency] = useState('');
//     const [result, setResult] = useState('');

//     const convertCurrency = async () => {
//         try {
//             const response = await axios.get(`http://api.exchangeratesapi.io/latest?base=${fromCurrency}&symbols=${toCurrency}&access_key=YOUR_ACCESS_KEY`);
//             const rate = response.data.rates[toCurrency];
//             setResult((parseFloat(amount) * rate).toFixed(2));
//         } catch (error) {
//             console.error('Error fetching exchange rates:', error);
//         }
//     };

//     return (
//         <section className='sectionCalculators'>
//             <h2>Currency Converter</h2>
//             <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 placeholder="Enter amount"
//             />
//             <select
//                 value={fromCurrency}
//                 onChange={(e) => setFromCurrency(e.target.value)}
//             >
//                 <option value="">Select currency</option>
//                 {/* Add options for currencies */}
//             </select>
//             <select
//                 value={toCurrency}
//                 onChange={(e) => setToCurrency(e.target.value)}
//             >
//                 <option value="">Select currency</option>
//                 {/* Add options for currencies */}
//             </select>
//             <button onClick={convertCurrency}>Convert</button>
//             {result && (
//                 <p>{`${amount} ${fromCurrency} equals ${result} ${toCurrency}`}</p>
//             )}
//         </section>
//     );
// }