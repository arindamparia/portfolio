import { useState, useEffect, useCallback, useRef } from 'react';

const useTimeSync = () => {
    const [offset, setOffset] = useState(0);
    const failureCountRef = useRef(0);
    const nextSyncTimeoutRef = useRef(null);

    useEffect(() => {
        const fetchServerTimeWithFallback = async () => {
            // Source 1: GitHub API (most reliable, doesn't need IP-based location)
            try {
                const response = await fetch('https://api.github.com', {
                    method: 'HEAD',
                    cache: 'no-store'
                });
                const dateHeader = response.headers.get('date');
                if (dateHeader) {
                    const time = new Date(dateHeader).getTime();
                    if (!isNaN(time)) {
                        return time;
                    }
                }
            } catch (error) {
                // Silent fail, try next source
            }

            // Source 2: Cloudflare's time API
            try {
                const response = await fetch('https://cloudflare.com/cdn-cgi/trace', {
                    cache: 'no-store'
                });
                const dateHeader = response.headers.get('date');
                if (dateHeader) {
                    const time = new Date(dateHeader).getTime();
                    if (!isNaN(time)) {
                        return time;
                    }
                }
            } catch (error) {
                // Silent fail, try next source
            }

            // Source 3: Own server's Date header
            try {
                const response = await fetch(window.location.origin, {
                    method: 'HEAD',
                    cache: 'no-store'
                });
                const dateHeader = response.headers.get('date');
                if (dateHeader) {
                    const time = new Date(dateHeader).getTime();
                    if (!isNaN(time)) {
                        return time;
                    }
                }
            } catch (error) {
                // Silent fail
            }

            return null;
        };

        const syncTime = async () => {
            try {
                // Fetch server time
                console.log('🔄 Syncing time with server...');
                const serverTime = await fetchServerTimeWithFallback();

                if (serverTime) {
                    const deviceTime = Date.now();
                    const newOffset = serverTime - deviceTime;

                    // Log the time difference for debugging
                    console.log(`⏱️ Server time: ${new Date(serverTime).toLocaleTimeString()}`);
                    console.log(`⏱️ Device time: ${new Date(deviceTime).toLocaleTimeString()}`);
                    console.log(`⏱️ Difference: ${Math.round(newOffset / 1000)}s`);

                    // Always set the offset to show accurate server time
                    setOffset(newOffset);
                    localStorage.setItem('timeOffset', newOffset.toString());
                    localStorage.setItem('timeOffsetTimestamp', Date.now().toString());
                    failureCountRef.current = 0; // Reset failure count on success

                    if (Math.abs(newOffset) > 5000) { // More than 5 seconds off
                        console.log(`⚠️ Device time is off by ${Math.round(newOffset / 1000)}s`);
                    }
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
