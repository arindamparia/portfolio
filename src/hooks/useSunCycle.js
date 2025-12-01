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

                // Check if we have valid cached data for the same location from today AND it has the new fields
                const isSameDay = solarCacheTime && new Date(parseInt(solarCacheTime)).toDateString() === new Date().toDateString();
                const isSameLocation = cachedLocationKey === locationKey;
                const cachedDataParsed = cachedSolarData ? JSON.parse(cachedSolarData) : null;
                const hasNewFields = cachedDataParsed?.results?.solar_noon;

                if (cachedDataParsed && isSameDay && isSameLocation && hasNewFields) {
                    console.log('💾 Using cached solar data');
                    sunData = cachedDataParsed;
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

                const { sunrise, sunset, civil_twilight_begin, civil_twilight_end, nautical_twilight_begin, nautical_twilight_end, solar_noon } = sunData.results;

                // Convert UTC strings to local Date objects
                const now = new Date();
                const sunriseTime = new Date(sunrise);
                const sunsetTime = new Date(sunset);
                const dawnTime = new Date(civil_twilight_begin);
                const duskTime = new Date(civil_twilight_end);
                const blueHourMorning = new Date(nautical_twilight_begin);
                const blueHourEvening = new Date(nautical_twilight_end);
                const solarNoonTime = solar_noon ? new Date(solar_noon) : new Date(sunriseTime.getTime() + (sunsetTime.getTime() - sunriseTime.getTime()) / 2);

                setSolarData({ sunrise: sunriseTime, sunset: sunsetTime, solarNoon: solarNoonTime });

                if (isNaN(solarNoonTime.getTime())) {
                    console.error('❌ Solar Noon is Invalid Date');
                    throw new Error('Invalid Solar Data');
                }

                // Time diffs in milliseconds
                const msPerMin = 60000;

                // Define Noon Window (30 mins before and after solar noon)
                const noonStart = new Date(solarNoonTime.getTime() - 30 * msPerMin);
                const noonEnd = new Date(solarNoonTime.getTime() + 30 * msPerMin);

                // Define Morning Segments
                const morningDuration = noonStart.getTime() - sunriseTime.getTime();
                const morningSegment = morningDuration / 3;
                const earlyMorningEnd = new Date(sunriseTime.getTime() + morningSegment);
                const lateMorningStart = new Date(noonStart.getTime() - morningSegment);

                // Define Afternoon Segments
                const afternoonDuration = sunsetTime.getTime() - noonEnd.getTime();
                const afternoonSegment = afternoonDuration / 3;
                const earlyAfternoonEnd = new Date(noonEnd.getTime() + afternoonSegment);
                const lateAfternoonStart = new Date(sunsetTime.getTime() - afternoonSegment);

                // Define Early Night (2 hours after Blue Hour ends)
                const earlyNightEnd = new Date(blueHourEvening.getTime() + 120 * msPerMin);

                // Define Pre-Dawn (2 hours before Blue Hour starts)
                const preDawnStart = new Date(blueHourMorning.getTime() - 120 * msPerMin);

                console.log('☀️ Solar Cycle Times:', {
                    now: now.toLocaleTimeString(),
                    preDawnStart: preDawnStart.toLocaleTimeString(),
                    blueHourMorning: blueHourMorning.toLocaleTimeString(),
                    dawnTime: dawnTime.toLocaleTimeString(),
                    sunriseTime: sunriseTime.toLocaleTimeString(),
                    earlyMorningEnd: earlyMorningEnd.toLocaleTimeString(),
                    lateMorningStart: lateMorningStart.toLocaleTimeString(),
                    noonStart: noonStart.toLocaleTimeString(),
                    solarNoon: solarNoonTime.toLocaleTimeString(),
                    noonEnd: noonEnd.toLocaleTimeString(),
                    earlyAfternoonEnd: earlyAfternoonEnd.toLocaleTimeString(),
                    lateAfternoonStart: lateAfternoonStart.toLocaleTimeString(),
                    sunsetTime: sunsetTime.toLocaleTimeString(),
                    duskTime: duskTime.toLocaleTimeString(),
                    blueHourEvening: blueHourEvening.toLocaleTimeString(),
                    earlyNightEnd: earlyNightEnd.toLocaleTimeString()
                });

                // 4. Determine Cycle (Granular)
                let currentCycle = 'night';
                let isDaytime = false;

                if (now >= preDawnStart && now < blueHourMorning) {
                    currentCycle = 'pre-dawn';
                    isDaytime = false;
                } else if (now >= blueHourMorning && now < dawnTime) {
                    currentCycle = 'blue-hour-morning';
                    isDaytime = false;
                } else if (now >= dawnTime && now < sunriseTime) {
                    currentCycle = 'dawn';
                    isDaytime = true;
                } else if (now >= sunriseTime && now < earlyMorningEnd) {
                    currentCycle = 'early-morning';
                    isDaytime = true;
                } else if (now >= earlyMorningEnd && now < lateMorningStart) {
                    currentCycle = 'morning';
                    isDaytime = true;
                } else if (now >= lateMorningStart && now < noonStart) {
                    currentCycle = 'late-morning';
                    isDaytime = true;
                } else if (now >= noonStart && now < noonEnd) {
                    currentCycle = 'noon';
                    isDaytime = true;
                } else if (now >= noonEnd && now < earlyAfternoonEnd) {
                    currentCycle = 'early-afternoon';
                    isDaytime = true;
                } else if (now >= earlyAfternoonEnd && now < lateAfternoonStart) {
                    currentCycle = 'afternoon';
                    isDaytime = true;
                } else if (now >= lateAfternoonStart && now < sunsetTime) {
                    currentCycle = 'late-afternoon'; // Golden Hour
                    isDaytime = true;
                } else if (now >= sunsetTime && now < duskTime) {
                    currentCycle = 'dusk';
                    isDaytime = false;
                } else if (now >= duskTime && now < blueHourEvening) {
                    currentCycle = 'blue-hour';
                    isDaytime = false;
                } else if (now >= blueHourEvening && now < earlyNightEnd) {
                    currentCycle = 'early-night';
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
