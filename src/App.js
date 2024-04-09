import Header from './components/Header/Header'
import Button from './components/Button/Button';
import Now from './components/Now/Now'
import { useState } from 'react'

import './App.css';

function App() {

  const [contentType, setContentType] = useState();

  function handleClick(type) {
    console.log("button cliked", type)
    setContentType(type)
  }

  return (
    <div className="App">
      <Header />
      <main className='App-main'>
        <div className='App-main-menu'>
          <Button isActive={contentType === 'Overview'} onClick={() => handleClick('Overview')}>Overview</Button>
          <Button isActive={contentType === 'Counts'} onClick={() => handleClick('Counts')}>Counts</Button>
          <Button isActive={contentType === 'Budgeting'} onClick={() => handleClick('Budgeting')}>Budgeting</Button>
          <Button isActive={contentType === 'Transactions'} onClick={() => handleClick('Transactions')}>Transactions</Button>
          <Button isActive={contentType === 'Reports'} onClick={() => handleClick('Reports')}>Reports</Button>
        </div>
        <div className='App-main-contents'>
          <Now contentType={contentType}></Now>
        </div>
      </main>

      <footer className='App-footer'>

      </footer>
    </div>
  );
}

export default App;
