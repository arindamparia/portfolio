import { useState, useEffect, useCallback } from 'react';
import { TIMING } from '../constants/timing';
import { isLocalhost } from '../utils/environment';

/**
 * Fetches server time from production server's Date header
 */
const fetchServerTime = async () => {
    const response = await fetch(`${window.location.origin}/api/time.json?t=${Date.now()}`, {
        cache: 'no-store'
    });
    const dateHeader = response.headers.get('date');
    return dateHeader ? new Date(dateHeader).getTime() : null;
};

/**
 * Calculates time offset between server and device
 */
const calculateOffset = (serverTime, deviceTime) => {
    const offset = serverTime - deviceTime;

    // Only apply offset if difference exceeds threshold
    if (Math.abs(offset) >= TIMING.TIME_SYNC_THRESHOLD) {
        console.log(`⏱️ Time corrected: Device was ${Math.round(offset / 1000)}s off`);
        return offset;
    }
    return 0;
};

/**
 * Custom hook for time synchronization with server
 * Syncs device time with server time to ensure accurate time display
 */
const useTimeSync = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const syncTime = async () => {
            // Skip sync on localhost
            if (isLocalhost()) return;

            try {
                const serverTime = await fetchServerTime();
                if (serverTime) {
                    const deviceTime = Date.now();
                    const newOffset = calculateOffset(serverTime, deviceTime);
                    setOffset(newOffset);
                }
            } catch (error) {
                // Silent fail - use device time
            }
        };

        // Initial sync
        syncTime();

        // Periodic sync
        const interval = setInterval(syncTime, TIMING.TIME_SYNC_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    // Get current time with offset applied
    const getCurrentTime = useCallback(() => {
        return new Date(Date.now() + offset);
    }, [offset]);

    return { getCurrentTime, offset };
};

export default useTimeSync;
