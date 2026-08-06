import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { personalInfo } from '../../constants/personalInfo';
import { educationData } from '../../data/education';
import { projectsData } from '../../data/projects';
import { skillsData } from '../../data/skills';
import MatrixBackground from '../Shared/MatrixBackground';

// Using Unicode block characters so escaping backslashes is not an issue. Extremely crisp and clear!
const asciiArt = [
    " █████╗ ██████╗ ██╗███╗   ██╗██████╗  █████╗ ███╗   ███╗",
    "██╔══██╗██╔══██╗██║████╗  ██║██╔══██╗██╔══██╗████╗ ████║",
    "███████║██████╔╝██║██╔██╗ ██║██║  ██║███████║██╔████╔██║",
    "██╔══██║██╔══██╗██║██║╚██╗██║██║  ██║██╔══██║██║╚██╔╝██║",
    "██║  ██║██║  ██║██║██║ ╚████║██████╔╝██║  ██║██║ ╚═╝ ██║",
    "╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝"
];

const bootSequence = [
    'Initializing boot sequence...',
    'Loading kernel modules... [OK]',
    'Mounting file systems... [OK]',
    'Starting network interface... [OK]',
    'Establishing secure connection... [OK]',
    'Access granted.',
];

const TypewriterBlock = ({ lines, onComplete }) => {
    const [visibleChars, setVisibleChars] = useState(0);
    const fullText = lines.join('\n');
    
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setVisibleChars(prev => prev + 4); // Speed of typing (4 chars at a time)
            i += 4;
            if (i >= fullText.length) {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, 10); // 10ms per tick
        return () => clearInterval(interval);
    }, [fullText, onComplete]);

    return (
        <pre>
            {fullText.substring(0, visibleChars)}
            {visibleChars < fullText.length && <span className="blinking-cursor-block" style={{ display: 'inline-block', width: '8px', height: '1em', backgroundColor: '#39FF14' }}></span>}
        </pre>
    );
};

const HackerLayout = ({ changeTheme }) => {
    const [booting, setBooting] = useState(true);
    const [bootLineIndex, setBootLineIndex] = useState(0);
    const [history, setHistory] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Handle Boot Sequence
    useEffect(() => {
        if (!booting) return;

        if (bootLineIndex < bootSequence.length) {
            const timer = setTimeout(() => {
                setBootLineIndex(prev => prev + 1);
            }, 300); // 300ms per line
            return () => clearTimeout(timer);
        } else {
            // Boot finished, auto-execute profile fetch
            setTimeout(() => {
                setBooting(false);
                executeCommand('./fetch_profile.sh');
            }, 800);
        }
    }, [bootLineIndex, booting]);

    // Focus input when clicking anywhere
    const handleContainerClick = () => {
        if (inputRef.current && !isTyping) {
            inputRef.current.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isTyping) {
            const cmd = inputValue.trim();
            if (cmd) {
                setHistory(prev => [...prev, { type: 'input', text: `arindam@portfolio:~$ ${cmd}` }]);
                executeCommand(cmd);
            }
            setInputValue('');
        }
    };

    const executeCommand = (cmd) => {
        const parts = cmd.toLowerCase().split(' ');
        const command = parts[0];
        const arg = parts[1];
        let output = [];

        switch (command) {
            case 'help':
                output = [
                    'AVAILABLE COMMANDS:',
                    '-------------------',
                    '  whoami          - Display personal information',
                    '  education       - View academic background & JEE Rank',
                    '  skills          - List technical skills',
                    '  projects        - View recent projects',
                    '  theme [name]    - Switch UI layout (modern, ide)',
                    '  clear           - Clear terminal output',
                    '  sudo            - ???',
                    '  exit            - Return to modern theme'
                ];
                break;
            case 'clear':
                // keep the initial fetch profile output
                setHistory(prev => prev.length > 0 ? [prev[0]] : []);
                return;
            case 'whoami':
                output = [
                    '======================================',
                    ` USER: ${personalInfo.name.full}`,
                    ` ROLE: ${personalInfo.title}`,
                    ` LOC : ${personalInfo.location}`,
                    '======================================',
                    ' STATUS: ALL SYSTEMS NOMINAL'
                ];
                break;
            case 'education':
                output = [
                    '[ACADEMIC RECORDS]',
                    '-------------------',
                    ...educationData.flatMap(ed => [
                        `> ${ed.degree}`,
                        `  ├─ Inst: ${ed.institution}`,
                        `  ├─ Year: ${ed.year}`,
                        `  └─ Note: ${ed.details.replace(/\n/g, ' | ')}`,
                        ''
                    ])
                ];
                break;
            case 'skills':
                output = [
                    '[SYSTEM CAPABILITIES]',
                    '---------------------',
                    ...Object.keys(skillsData).flatMap(category => [
                        `> ${category.toUpperCase()}`,
                        `  └─ [ ${skillsData[category].join(', ')} ]`,
                        ''
                    ])
                ];
                break;
            case 'projects':
                output = [
                    '[DEPLOYED PROTOCOLS]',
                    '--------------------',
                    ...projectsData.map((p, i) => [
                        `[0${i + 1}] ${p.name.toUpperCase()}`,
                        `  ├─ Desc: ${p.description}`,
                        `  └─ Tech: ${p.tech.join(', ')}`,
                        ''
                    ]).flat()
                ];
                break;
            case 'sudo':
                output = [
                    'arindam is not in the sudoers file.',
                    'This incident will be reported.'
                ];
                break;
            case 'theme':
                if (arg === 'modern' || arg === 'ide') {
                    output = [`Switching to ${arg} mode...`];
                    setTimeout(() => changeTheme(arg), 1500);
                } else {
                    output = [
                        'Usage: theme [name]',
                        'Available themes: modern, ide'
                    ];
                }
                break;
            case 'exit':
                output = ['Terminating session... returning to modern UI.'];
                setTimeout(() => changeTheme('modern'), 1500);
                break;
            case './fetch_profile.sh':
                output = [
                    ...asciiArt,
                    '',
                    '==================================================',
                    `Target: ${personalInfo.name.full}`,
                    `Designation: ${personalInfo.title}`,
                    'Status: CONNECTED',
                    '==================================================',
                    '',
                    'Type "help" to view available commands.'
                ];
                break;
            default:
                output = [`bash: ${command}: command not found. Type 'help' for available commands.`];
        }

        setIsTyping(true);
        setHistory(prev => [...prev, { type: 'output', lines: output, isNew: true }]);
    };

    const markAsOld = (index) => {
        setIsTyping(false);
        setHistory(prev => prev.map((item, i) => i === index ? { ...item, isNew: false } : item));
    };

    return (
        <div 
            className="hacker-terminal-container" 
            onClick={handleContainerClick}
        >
            <MatrixBackground />
            
            <div className="crt-overlay"></div>
            
            <div className="terminal-content">
                {booting && (
                    <div className="boot-sequence">
                        {bootSequence.slice(0, bootLineIndex).map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                        <div className="blinking-cursor-block"></div>
                    </div>
                )}

                {!booting && (
                    <div className="interactive-session">
                        {history.map((item, i) => (
                            <div key={i} className={`log-line ${item.type}`}>
                                {item.type === 'input' ? (
                                    <pre>{item.text}</pre>
                                ) : item.isNew ? (
                                    <TypewriterBlock lines={item.lines} onComplete={() => markAsOld(i)} />
                                ) : (
                                    <pre>{item.lines.join('\n')}</pre>
                                )}
                            </div>
                        ))}
                        
                        {!isTyping && (
                            <div className="input-line">
                                <span className="prompt">arindam@portfolio:~$ </span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    spellCheck="false"
                                    autoComplete="off"
                                    autoFocus
                                />
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            {!booting && !isTyping && (
                <div className="quick-commands">
                    <span className="muted">Quick exec: </span>
                    {['whoami', 'education', 'skills', 'projects', 'clear', 'exit'].map(cmd => (
                        <button key={cmd} onClick={() => {
                            setHistory(prev => [...prev, { type: 'input', text: `arindam@portfolio:~$ ${cmd}` }]);
                            executeCommand(cmd);
                        }}>
                            {cmd}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HackerLayout;
