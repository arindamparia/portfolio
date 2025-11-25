import React from 'react';
import { motion } from 'framer-motion';
import { VscChevronDown } from 'react-icons/vsc';
import { vibrateMedium } from '../../utils/vibration.js';

/**
 * Reusable section arrow component for navigating between sections
 * @param {Object} props
 * @param {string} props.targetSection - The ID of the target section to navigate to (e.g., "#about")
 * @param {number} [props.delay=0.5] - Animation delay in seconds
 */
const SectionArrow = ({ targetSection, delay = 0.5 }) => {
    return (
        <motion.div
            className="section-arrow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
        >
            <a href={targetSection} onClick={vibrateMedium}>
                <VscChevronDown />
            </a>
        </motion.div>
    );
};

export default SectionArrow;
