import React, { useState } from 'react';
import './Tasks.css';

import ReactPaginate from 'react-paginate';
import Task from './Task/Task';
import FormAddTask from './FormAddTask/FormAddTask';
import Modal from 'react-modal';

export default function Tasks() {
    
    return (
        <section className='tasks'>
            <Task />
        </section>
    );
}
