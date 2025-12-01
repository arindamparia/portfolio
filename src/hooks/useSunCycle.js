import { useState, useEffect } from 'react';

const useSunCycle = () => {
    const [cycle, setCycle] = useState('day'); // 'dawn', 'day', 'dusk', 'night'
    const [isDay, setIsDay] = useState(true);
    const [loading, setLoading] = useState(true);
    const [solarData, setSolarData] = useState(null);

    useEffect(() => {
        console.log('🌅 useSunCycle hook mounted');

        const fetchData = async () => {
            console.log('📡 Starting sun cycle data fetch...');
            try {
                let latitude, longitude, city, country_name;

                // 1. Check Cache first
                const cachedLocation = localStorage.getItem('userLocation');
                const cacheTime = localStorage.getItem('userLocationTime');
                const ONE_HOUR = 60 * 60 * 1000;

                if (cachedLocation && cacheTime && (Date.now() - parseInt(cacheTime) < ONE_HOUR)) {
                    const data = JSON.parse(cachedLocation);

                    // Only use cache if it has the new timezone field
                    if (data.timezone) {
                        console.log('💾 Using cached location data');
                        latitude = data.latitude;
                        longitude = data.longitude;
                        city = data.city;
                        country_name = data.country_name;
                    } else {
                        console.log('⚠️ Cache missing timezone, fetching fresh data...');
                        // Don't throw, just let it fall through to the API fetch block below
                    }
                }

                // If we didn't get data from cache (either no cache, expired, or missing timezone)
                if (!latitude) {
                    // 2. Fetch from API if no cache
                    console.log('🌍 Fetching IP location from ipwho.is...');
                    // Using ipwho.is which is more lenient with CORS and rate limits
                    const ipRes = await fetch('https://ipwho.is/');
                    const ipData = await ipRes.json();

                    if (!ipData.success) {
                        throw new Error(`Location fetch failed: ${ipData.message}`);
                    }

                    latitude = ipData.latitude;
                    longitude = ipData.longitude;
                    city = ipData.city;
                    country_name = ipData.country;
                    const timezone = ipData.timezone?.id; // Extract timezone ID

                    // Cache the successful result
                    localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude, city, country_name, timezone }));
                    localStorage.setItem('userLocationTime', Date.now().toString());
                }

                console.log(`📍 Location detected: ${city}, ${country_name} (${latitude}, ${longitude})`);

                // 3. Get Sunrise/Sunset
                const cachedSolarData = localStorage.getItem('solarData');
                const solarCacheTime = localStorage.getItem('solarDataTime');

                // Create a unique key for the location to ensure cache matches current location
                const locationKey = `${latitude},${longitude}`;
                const cachedLocationKey = localStorage.getItem('solarDataLocation');

                let sunData;

                // Check if we have valid cached data for the same location from today
                const isSameDay = solarCacheTime && new Date(parseInt(solarCacheTime)).toDateString() === new Date().toDateString();
                const isSameLocation = cachedLocationKey === locationKey;

                if (cachedSolarData && isSameDay && isSameLocation) {
                    console.log('💾 Using cached solar data');
                    sunData = JSON.parse(cachedSolarData);
                } else {
                    console.log('☀️ Fetching new solar data from API...');
                    const sunRes = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`);
                    sunData = await sunRes.json();

                    if (sunData.status !== 'OK') throw new Error('Solar data fetch failed');

                    // Cache the new data
                    localStorage.setItem('solarData', JSON.stringify(sunData));
                    localStorage.setItem('solarDataTime', Date.now().toString());
                    localStorage.setItem('solarDataLocation', locationKey);
                }

                const { sunrise, sunset, civil_twilight_begin, civil_twilight_end, nautical_twilight_begin, nautical_twilight_end } = sunData.results;

                // Convert UTC strings to local Date objects
                const now = new Date();
                const sunriseTime = new Date(sunrise);
                const sunsetTime = new Date(sunset);
                const dawnTime = new Date(civil_twilight_begin);
                const duskTime = new Date(civil_twilight_end);
                const blueHourMorning = new Date(nautical_twilight_begin);
                const blueHourEvening = new Date(nautical_twilight_end);

                setSolarData({ sunrise: sunriseTime, sunset: sunsetTime });

                console.log('☀️ Solar Data:', {
                    source: cachedSolarData && isSameDay && isSameLocation ? 'Cache' : 'API',
                    now: now.toLocaleTimeString(),
                    sunrise: sunriseTime.toLocaleTimeString(),
                    sunset: sunsetTime.toLocaleTimeString(),
                    dawn: dawnTime.toLocaleTimeString(),
                    dusk: duskTime.toLocaleTimeString(),
                    blueHourMorning: blueHourMorning.toLocaleTimeString(),
                    blueHourEvening: blueHourEvening.toLocaleTimeString()
                });

                // 4. Determine Cycle
                let currentCycle = 'night';
                let isDaytime = false;

                if (now >= blueHourMorning && now < dawnTime) {
                    currentCycle = 'blue-hour';
                    isDaytime = false;
                } else if (now >= dawnTime && now < sunriseTime) {
                    currentCycle = 'dawn';
                    isDaytime = true;
                } else if (now >= sunriseTime && now < sunsetTime) {
                    currentCycle = 'day';
                    isDaytime = true;
                } else if (now >= sunsetTime && now < duskTime) {
                    currentCycle = 'dusk';
                    isDaytime = false;
                } else if (now >= duskTime && now < blueHourEvening) {
                    currentCycle = 'blue-hour';
                    isDaytime = false;
                } else {
                    currentCycle = 'night';
                    isDaytime = false;
                }

                setCycle(currentCycle);
                setIsDay(isDaytime);

                console.log(`🔄 Current Cycle: ${currentCycle.toUpperCase()} (Daytime: ${isDaytime})`);

            } catch (error) {
                console.error('Error fetching sun cycle:', error);

                // Fallback to simple hour-based logic
                const hour = new Date().getHours();
                if (hour >= 6 && hour < 18) {
                    setCycle('day');
                    setIsDay(true);
                } else {
                    setCycle('night');
                    setIsDay(false);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Refresh every 5 minutes
        const interval = setInterval(fetchData, 60000 * 5);
        return () => clearInterval(interval);
    }, []);

    return { cycle, isDay, loading, solarData };
};

export default useSunCycle;
