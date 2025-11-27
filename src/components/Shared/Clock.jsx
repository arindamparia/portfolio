import React, { useState, useEffect } from 'react';

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Get time-based background color
    const getBackgroundColor = () => {
        const hour = time.getHours();

        // Early Morning (5-7): Soft purple/pink gradient
        if (hour >= 5 && hour < 7) {
            return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
        // Morning (7-12): Bright yellow/orange gradient
        else if (hour >= 7 && hour < 12) {
            return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        }
        // Afternoon (12-17): Blue/cyan gradient
        else if (hour >= 12 && hour < 17) {
            return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
        }
        // Evening (17-20): Orange/red gradient
        else if (hour >= 17 && hour < 20) {
            return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
        }
        // Night (20-5): Dark blue/purple gradient
        else {
            return 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)';
        }
    };

    // Format time as HH:MM:SS
    const formatTime = () => {
        return time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    // Format date as "Day, Month DD"
    const formatDate = () => {
        return time.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div
            className="navbar-clock"
            style={{
                background: getBackgroundColor(),
                padding: '0.5rem 1rem',
                borderRadius: '0.75rem',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.85rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                minWidth: '140px',
                userSelect: 'none',
                transition: 'background 0.5s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.1rem'
            }}
        >
            <div style={{
                fontSize: '1rem',
                fontFamily: 'monospace',
                letterSpacing: '0.5px'
            }}>
                {formatTime()}
            </div>
            <div style={{
                fontSize: '0.7rem',
                opacity: 0.9,
                fontWeight: '500'
            }}>
                {formatDate()}
            </div>
        </div>
    );
};

export default Clock;
