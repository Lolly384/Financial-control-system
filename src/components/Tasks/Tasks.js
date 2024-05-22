import React, { useState } from 'react';
import './Tasks.css';

import Task from './Task/Task';

export default function Tasks() {
    
    return (
        <section className='tasks'>
            <Task />
        </section>
    );
}
