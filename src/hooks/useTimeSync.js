import { useState, useEffect, useCallback } from 'react';

const useTimeSync = () => {
    const [offset, setOffset] = useState(0);
    const [failureCount, setFailureCount] = useState(0);

    useEffect(() => {
        const syncTime = async () => {
            try {
                // 1. Check Cache
                const cachedOffset = localStorage.getItem('timeOffset');
                const cachedTimestamp = localStorage.getItem('timeOffsetTimestamp');
                const CACHE_DURATION = 30 * 1000; // 30 seconds

                if (cachedOffset && cachedTimestamp && (Date.now() - parseInt(cachedTimestamp) < CACHE_DURATION)) {
                    setOffset(parseInt(cachedOffset));
                    return;
                }

                // 2. Try multiple sources with fallback
                const serverTime = await fetchServerTimeWithFallback();

                if (serverTime) {
                    const deviceTime = Date.now();
                    let newOffset = serverTime - deviceTime;

                    // Only apply offset if difference is significant (> 1 minute)
                    const THRESHOLD = 60 * 1000;
                    if (Math.abs(newOffset) < THRESHOLD) {
                        newOffset = 0;
                    } else {
                        console.log(`⏱️ Time adjusted: Device time off by ${Math.round(newOffset / 1000)}s`);
                    }

                    // 3. Update State and Cache
                    setOffset(newOffset);
                    localStorage.setItem('timeOffset', newOffset.toString());
                    localStorage.setItem('timeOffsetTimestamp', Date.now().toString());
                    setFailureCount(0); // Reset failure count on success
                } else {
                    // If all sources fail, increment failure count
                    setFailureCount(prev => prev + 1);
                    console.warn('⚠️ All time sources failed. Using device time.');
                }

            } catch (error) {
                console.error('❌ Error synchronizing time:', error);
                setFailureCount(prev => prev + 1);
            }
        };

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

        syncTime();

        // Re-sync every 30 seconds
        // If failures persist, back off exponentially (max 5 minutes)
        const getSyncInterval = () => {
            if (failureCount === 0) return 30 * 1000; // 30s
            if (failureCount < 3) return 60 * 1000; // 1min
            if (failureCount < 6) return 2 * 60 * 1000; // 2min
            return 5 * 60 * 1000; // 5min
        };

        const interval = setInterval(syncTime, getSyncInterval());
        return () => clearInterval(interval);
    }, [failureCount]);

    // Helper to get the current synchronized time
    const getCurrentTime = useCallback(() => {
        return new Date(Date.now() + offset);
    }, [offset]);

    return { getCurrentTime, offset };
};

export default useTimeSync;
