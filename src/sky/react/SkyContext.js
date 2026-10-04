import { createContext, useContext } from 'react';

export const SkyContext = createContext({
    sky: null,
    status: 'fallback',
    colors: null,
    cycle: 'night',
    solarData: null,
    isDay: false,
    paused: false,
    setPaused: () => {},
    isSmall: false,
    lowPower: false,
    reducedMotion: false,
    animate: false,
});

export const useSky = () => useContext(SkyContext);
