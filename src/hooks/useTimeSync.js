import { useState, useEffect, useCallback, useRef } from 'react';

const useTimeSync = () => {
    const [offset, setOffset] = useState(0);
    const failureCountRef = useRef(0);
    const nextSyncTimeoutRef = useRef(null);

    useEffect(() => {
        const fetchServerTimeWithFallback = async () => {
            // On localhost, skip external time sources for development
            if (window.location.hostname === 'localhost' || window.location.hostname.startsWith('127.')) {
                console.log('🏠 Running on localhost - using device time for development');
                return Date.now(); // Use device time on localhost
            }

            // Source 1: Production server (most reliable for your deployed site)
            try {
                const response = await fetch(window.location.origin + '/favicon.ico', {
                    method: 'HEAD',
                    cache: 'no-store'
                });
                const dateHeader = response.headers.get('date');
                if (dateHeader) {
                    const time = new Date(dateHeader).getTime();
                    if (!isNaN(time)) {
                        console.log('✅ Using time from: Production Server');
                        return time;
                    }
                }
            } catch (error) {
                console.log('❌ Production server failed:', error.message);
            }

            // Source 2: World Time API
            try {
                const response = await fetch('https://worldtimeapi.org/api/ip', {
                    cache: 'no-store'
                });
                const data = await response.json();
                if (data.unixtime) {
                    const time = data.unixtime * 1000;
                    console.log('✅ Using time from: WorldTimeAPI');
                    return time;
                }
            } catch (error) {
                console.log('❌ WorldTimeAPI failed:', error.message);
            }

            console.warn('⚠️ All time sources failed. Using device time.');
            return null;
        };

        const syncTime = async () => {
            try {
                // Fetch server time
                console.log('🔄 Syncing time with server...');
                const serverTime = await fetchServerTimeWithFallback();

                if (serverTime) {
                    const deviceTime = Date.now();
                    let newOffset = serverTime - deviceTime;

                    // Log the time difference for debugging
                    console.log(`⏱️ Server time: ${new Date(serverTime).toLocaleTimeString()}`);
                    console.log(`⏱️ Device time: ${new Date(deviceTime).toLocaleTimeString()}`);
                    console.log(`⏱️ Difference: ${Math.round(newOffset / 1000)}s`);

                    // Only apply offset if difference is more than 1 minute
                    const THRESHOLD = 60 * 1000; // 1 minute in milliseconds
                    if (Math.abs(newOffset) < THRESHOLD) {
                        console.log('✅ Device time is accurate (within 1 minute). Using device time.');
                        newOffset = 0;
                    } else {
                        console.log(`⚠️ Device time is off by ${Math.round(newOffset / 1000)}s. Adjusting to server time.`);
                    }

                    // Set the offset
                    setOffset(newOffset);
                    localStorage.setItem('timeOffset', newOffset.toString());
                    localStorage.setItem('timeOffsetTimestamp', Date.now().toString());
                    failureCountRef.current = 0; // Reset failure count on success
                } else {
                    // If all sources fail, increment failure count
                    failureCountRef.current += 1;
                    console.warn('⚠️ All time sources failed. Using device time.');
                }

            } catch (error) {
                console.error('❌ Error synchronizing time:', error);
                failureCountRef.current += 1;
            }

            // Schedule next sync
            scheduleNextSync();
        };

        const scheduleNextSync = () => {
            // Clear any existing timeout
            if (nextSyncTimeoutRef.current) {
                clearTimeout(nextSyncTimeoutRef.current);
            }

            // Determine next sync interval based on failure count
            let nextInterval;
            if (failureCountRef.current === 0) {
                nextInterval = 30 * 1000; // 30s
            } else if (failureCountRef.current < 3) {
                nextInterval = 60 * 1000; // 1min
            } else if (failureCountRef.current < 6) {
                nextInterval = 2 * 60 * 1000; // 2min
            } else {
                nextInterval = 5 * 60 * 1000; // 5min
            }

            nextSyncTimeoutRef.current = setTimeout(syncTime, nextInterval);
        };

        // Initial sync
        syncTime();

        // Cleanup
        return () => {
            if (nextSyncTimeoutRef.current) {
                clearTimeout(nextSyncTimeoutRef.current);
            }
        };
    }, []);

    // Helper to get the current synchronized time
    const getCurrentTime = useCallback(() => {
        return new Date(Date.now() + offset);
    }, [offset]);

    return { getCurrentTime, offset };
};

export default useTimeSync;
