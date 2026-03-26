import { motion } from 'framer-motion';
import { FaCode, FaArrowRight } from 'react-icons/fa';
import { socialLinks } from '../../constants/personalInfo';
import { vibrateLight } from '../../utils/vibration';

const DsaBanner = () => {
    return (
        <section className="dsa-banner-section">
            <div className="container">
                <motion.div
                    className="dsa-banner"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="dsa-banner-icon">
                        <FaCode />
                    </div>
                    <div className="dsa-banner-content">
                        <h3 className="dsa-banner-title">Want to practice DSA?</h3>
                        <p className="dsa-banner-text">
                            Track, optimize, and master your Data Structures & Algorithms journey with AlgoTracker.
                        </p>
                    </div>
                    <motion.a
                        href={socialLinks.algotracker.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dsa-banner-btn"
                        onClick={vibrateLight}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Let's Go <FaArrowRight />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default DsaBanner;
