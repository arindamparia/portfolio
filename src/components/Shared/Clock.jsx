import React, { useState, useEffect } from 'react';

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Get time-based background color following daylight cycle
    const getBackgroundColor = () => {
        const hour = time.getHours();

        // Pre-Dawn (3-5 AM): Very dark, darkest before dawn
        if (hour >= 3 && hour < 5) {
            return 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
        }
        // Dawn (5-6 AM): Dusky purple/orange, sun beginning to rise
        else if (hour >= 5 && hour < 6) {
            return 'linear-gradient(135deg, #4a1a4a 0%, #7c3a61 100%)';
        }
        // Early Morning (6-8 AM): Warm orange/pink, brightening
        else if (hour >= 6 && hour < 8) {
            return 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)';
        }
        // Morning (8-10 AM): Bright yellow/light blue, getting brighter
        else if (hour >= 8 && hour < 10) {
            return 'linear-gradient(135deg, #ffd93d 0%, #6bcfff 100%)';
        }
        // Late Morning (10-12 PM): Very bright, approaching noon
        else if (hour >= 10 && hour < 12) {
            return 'linear-gradient(135deg, #fff89a 0%, #a8edea 100%)';
        }
        // Noon (12-1 PM): Brightest point - light yellow/white
        else if (hour >= 12 && hour < 13) {
            return 'linear-gradient(135deg, #fff9e6 0%, #e0f7fa 100%)';
        }
        // Early Afternoon (1-3 PM): Still very bright, slightly warmer
        else if (hour >= 13 && hour < 15) {
            return 'linear-gradient(135deg, #ffe5b4 0%, #b3e5fc 100%)';
        }
        // Afternoon (3-5 PM): Warm, bright but softening
        else if (hour >= 15 && hour < 17) {
            return 'linear-gradient(135deg, #ffd89b 0%, #80deea 100%)';
        }
        // Late Afternoon/Golden Hour (5-6 PM): Warm orange/pink
        else if (hour >= 17 && hour < 18) {
            return 'linear-gradient(135deg, #ff9a56 0%, #ff6b9d 100%)';
        }
        // Evening/Dusk (6-8 PM): Deep orange/purple, sun setting
        else if (hour >= 18 && hour < 20) {
            return 'linear-gradient(135deg, #fa709a 0%, #7c4dff 100%)';
        }
        // Early Night/Blue Hour (8-10 PM): Deep blue
        else if (hour >= 20 && hour < 22) {
            return 'linear-gradient(135deg, #667eea 0%, #4a5568 100%)';
        }
        // Night (10 PM-3 AM): Dark blue/purple, darkest around midnight
        else {
            return 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)';
        }
    };

    // Get text color based on background brightness
    const getTextColor = () => {
        const hour = time.getHours();
        // Dark text for bright hours (8 AM - 5 PM)
        if (hour >= 8 && hour < 17) {
            return '#1a1a1a';
        }
        // White text for dark hours
        return 'white';
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
                color: getTextColor(),
                fontWeight: '600',
                fontSize: '0.85rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                minWidth: '140px',
                userSelect: 'none',
                transition: 'background 0.5s ease, color 0.5s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.1rem'
            }}
        >
            <div style={{
                fontSize: '1rem',
                fontFamily: 'monospace',
                letterSpacing: '0.5px',
                textShadow: time.getHours() >= 8 && time.getHours() < 17
                    ? '0 1px 2px rgba(255, 255, 255, 0.5)'
                    : '0 1px 2px rgba(0, 0, 0, 0.5)'
            }}>
                {formatTime()}
            </div>
            <div style={{
                fontSize: '0.7rem',
                opacity: 0.85,
                fontWeight: '500'
            }}>
                {formatDate()}
            </div>
        </div>
    );
};

export default Clock;
