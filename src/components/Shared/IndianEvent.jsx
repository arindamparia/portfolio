import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEventsForDate, getRandomFact } from '../../data/indianDates';
import { FaCalendarDay, FaLightbulb, FaHistory, FaRocket, FaTrophy, FaFlag, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const IndianEvent = () => {
    const [eventsList, setEventsList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isEvent, setIsEvent] = useState(false);
    const [displayData, setDisplayData] = useState(null);

    useEffect(() => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateString = `${month}-${day}`;

        const events = getEventsForDate(dateString);

        if (events && events.length > 0) {
            setEventsList(events);
            setCurrentIndex(0);
            setDisplayData(events[0]);
            setIsEvent(true);
        } else {
            setDisplayData(getRandomFact());
            setIsEvent(false);
        }
    }, []);

    useEffect(() => {
        if (isEvent && eventsList.length > 0) {
            setDisplayData(eventsList[currentIndex]);
        }
    }, [currentIndex, isEvent, eventsList]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % eventsList.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + eventsList.length) % eventsList.length);
    };

    if (!displayData) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'national': return <FaFlag className="text-orange-500" />;
            case 'science': return <FaRocket className="text-blue-500" />;
            case 'sports': return <FaTrophy className="text-yellow-500" />;
            case 'history': return <FaHistory className="text-purple-500" />;
            default: return <FaLightbulb className="text-yellow-400" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="indian-event-card"
            style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1rem 1.5rem',
                maxWidth: '500px',
                margin: '2rem auto 0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Decorative tricolor strip */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(to bottom, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%)'
            }} />

            <div style={{ fontSize: '1.5rem', marginTop: '0.2rem' }}>
                {isEvent ? getIcon(displayData.type) : <FaLightbulb style={{ color: '#FCD34D' }} />}
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '0.25rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        {isEvent ? 'On This Day in India 🇮🇳' : 'Did You Know? 🇮🇳'}
                    </h4>

                    {isEvent && eventsList.length > 1 && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={handlePrev}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                            >
                                <FaChevronLeft size={12} />
                            </button>
                            <button
                                onClick={handleNext}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                            >
                                <FaChevronRight size={12} />
                            </button>
                        </div>
                    )}
                </div>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isEvent ? (
                            <>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                    marginBottom: '0.25rem'
                                }}>
                                    {displayData.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.95rem',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    lineHeight: '1.5'
                                }}>
                                    {displayData.description}
                                </p>
                                {eventsList.length > 1 && (
                                    <p style={{
                                        fontSize: '0.75rem',
                                        color: 'rgba(255, 255, 255, 0.4)',
                                        marginTop: '0.5rem',
                                        textAlign: 'right'
                                    }}>
                                        {currentIndex + 1} / {eventsList.length}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p style={{
                                fontSize: '1rem',
                                color: 'rgba(255, 255, 255, 0.9)',
                                lineHeight: '1.5',
                                fontStyle: 'italic'
                            }}>
                                "{displayData}"
                            </p>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default IndianEvent;
