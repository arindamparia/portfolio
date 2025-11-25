import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const InteractiveCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseOver = (e) => {
      const target = e.target;

      // Check for interactive elements
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.dataset.cursor === 'pointer' ||
        target.classList.contains('cursor-pointer') ||
        target.classList.contains('project-card') ||
        target.classList.contains('skill-card') ||
        target.classList.contains('skills-category-card') ||
        target.classList.contains('skill-tag') ||
        target.classList.contains('experience-card') ||
        target.classList.contains('education-card') ||
        target.classList.contains('file-item') ||
        target.classList.contains('tab') ||
        target.classList.contains('nav-link') ||
        target.classList.contains('theme-toggle') ||
        target.classList.contains('social-link')
      ) {
        setCursorVariant('hover');
      }
      // Check for text elements
      else if (
        target.tagName === 'P' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3' ||
        target.tagName === 'H4' ||
        target.tagName === 'H5' ||
        target.tagName === 'H6' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'LI' ||
        target.dataset.cursor === 'text'
      ) {
        setCursorVariant('text');
      }
      // Check for input fields
      else if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA'
      ) {
        setCursorVariant('input');
      }
      else {
        setCursorVariant('default');
      }
    };

    const handleMouseDown = () => {
      setCursorVariant('click');
    };

    const handleMouseUp = () => {
      // Reset to appropriate variant based on current element
      const target = document.elementFromPoint(mousePosition.x, mousePosition.y);
      if (target) {
        const event = { target };
        handleMouseOver(event);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mousePosition.x, mousePosition.y]);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      border: '2px solid rgba(99, 102, 241, 0.8)',
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      scale: 1.5,
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      border: '2px solid rgba(99, 102, 241, 1)',
    },
    text: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      scale: 0.8,
      backgroundColor: 'rgba(139, 92, 246, 0.3)',
      border: '2px solid rgba(139, 92, 246, 0.6)',
    },
    input: {
      x: mousePosition.x - 2,
      y: mousePosition.y - 16,
      scale: 1,
      backgroundColor: 'rgba(99, 102, 241, 0.4)',
      border: '2px solid rgba(99, 102, 241, 0.8)',
      width: '2px',
      height: '24px',
      borderRadius: '1px',
    },
    click: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      scale: 0.6,
      backgroundColor: 'rgba(139, 92, 246, 0.8)',
      border: '2px solid rgba(139, 92, 246, 1)',
    },
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="custom-cursor"
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      />

      {/* Cursor trail/dot */}
      <motion.div
        className="custom-cursor-dot"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: 'spring',
          stiffness: 1000,
          damping: 35,
          mass: 0.3,
        }}
      />
    </>
  );
};

export default InteractiveCursor;
