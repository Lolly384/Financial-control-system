import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({ progress }) {
    return (
        <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
    );
}
