import { useState, useEffect, useCallback } from 'react';

const useTimeSync = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const syncTime = async () => {
            // On localhost, use device time (no sync needed)
            if (window.location.hostname === 'localhost' || window.location.hostname.startsWith('127.')) {
                return;
            }

            // Production: Fetch server time from Date header
            try {
                const response = await fetch(`${window.location.origin}/api/time.json?t=${Date.now()}`, {
                    cache: 'no-store'
                });
                const dateHeader = response.headers.get('date');

                if (dateHeader) {
                    const serverTime = new Date(dateHeader).getTime();
                    const deviceTime = Date.now();
                    let newOffset = serverTime - deviceTime;

                    // Only apply offset if difference is more than 1 minute
                    const THRESHOLD = 60 * 1000;
                    if (Math.abs(newOffset) >= THRESHOLD) {
                        setOffset(newOffset);
                        console.log(`⏱️ Time corrected: Device was ${Math.round(newOffset / 1000)}s off`);
                    } else {
                        setOffset(0);
                    }
                }
            } catch (error) {
                // Silent fail - use device time
            }
        };

        // Initial sync
        syncTime();

        // Sync every 30 seconds
        const interval = setInterval(syncTime, 30 * 1000);

        return () => clearInterval(interval);
    }, []);

    // Helper to get the current synchronized time
    const getCurrentTime = useCallback(() => {
        return new Date(Date.now() + offset);
    }, [offset]);

    return { getCurrentTime, offset };
};

export default useTimeSync;
