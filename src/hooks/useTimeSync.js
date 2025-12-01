import { useState, useEffect, useCallback } from 'react';

const useTimeSync = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const syncTime = async () => {
            try {
                // 1. Check Cache
                const cachedOffset = localStorage.getItem('timeOffset');
                const cachedTimestamp = localStorage.getItem('timeOffsetTimestamp');
                const CACHE_DURATION = 30 * 1000; // 30 seconds

                if (cachedOffset && cachedTimestamp && (Date.now() - parseInt(cachedTimestamp) < CACHE_DURATION)) {
                    console.log('💾 Using cached time offset:', cachedOffset);
                    setOffset(parseInt(cachedOffset));
                    return;
                }

                // 2. Fetch Server Time
                console.log('📡 Fetching server time for synchronization...');
                const response = await fetch(window.location.href, { method: 'HEAD' });
                const serverDateStr = response.headers.get('date');

                if (serverDateStr) {
                    const serverTime = new Date(serverDateStr).getTime();
                    const deviceTime = Date.now();
                    let newOffset = serverTime - deviceTime;

                    console.log(`⏱️ Time Sync: Server=${serverTime}, Device=${deviceTime}, Raw Offset=${newOffset}ms`);

                    // Only apply offset if difference is significant (> 1 minute)
                    const THRESHOLD = 60 * 1000;
                    if (Math.abs(newOffset) < THRESHOLD) {
                        console.log('✅ Time difference is small. Using device time.');
                        newOffset = 0;
                    }

                    // 3. Update State and Cache
                    setOffset(newOffset);
                    localStorage.setItem('timeOffset', newOffset.toString());
                    localStorage.setItem('timeOffsetTimestamp', Date.now().toString());
                } else {
                    console.warn('⚠️ Could not get Date header from server.');
                }

            } catch (error) {
                console.error('❌ Error synchronizing time:', error);
            }
        };

        syncTime();

        // Re-sync every 30 seconds (matches cache duration)
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
