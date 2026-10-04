import React, { useState, useEffect, useEffectEvent, useRef } from 'react';
import { motion } from 'framer-motion';
import { personalInfo } from '../../constants/personalInfo';
import { educationData } from '../../data/education';
import { projectsData } from '../../data/projects';
import { skillsData } from '../../data/skills';
import { experienceData } from '../../data/experience';
import { careerMilestones } from '../../data/careerMilestones';
import { dijkstraTrace, kruskalTrace, searchTrace, sortTrace } from '../../sky/algorithms/terminalTraces';
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
                    '  run <algorithm> - kruskal, dijkstra, search, sort [merge|quick|heap|insertion]',
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
            case 'run': {
                const jee = educationData.find((e) => e.degree.includes('JEE'));
                const percentile = Number(jee?.details.match(/Percentile:\s*([\d.]+)/)?.[1]);
                const rank = Number(jee?.details.match(/Rank:\s*([\d,]+)/)?.[1].replace(/,/g, ''));
                const algorithms = {
                    kruskal: () => kruskalTrace(skillsData, experienceData, projectsData),
                    dijkstra: () => dijkstraTrace(careerMilestones()),
                    search: () => searchTrace(rank, percentile),
                    sort: () => sortTrace(parts[2] ?? 'merge'),
                };
                output = algorithms[arg]
                    ? algorithms[arg]()
                    : ['usage: run <algorithm>', '  kruskal    skills joined into a minimum spanning tree', '  dijkstra   shortest route through my career', '  search     binary search for my JEE rank', '  sort       sort race step trace: run sort quick'];
                break;
            }
            default:
                output = [`bash: ${command}: command not found. Type 'help' for available commands.`];
        }

        setIsTyping(true);
        setHistory(prev => [...prev, { type: 'output', lines: output, isNew: true }]);
    };

    // Runs the latest executeCommand without re-triggering the boot effect
    const runBootCommand = useEffectEvent(() => executeCommand('./fetch_profile.sh'));

    // Handle Boot Sequence
    useEffect(() => {
        if (!booting) return undefined;

        if (bootLineIndex < bootSequence.length) {
            const timer = setTimeout(() => {
                setBootLineIndex(prev => prev + 1);
            }, 300); // 300ms per line
            return () => clearTimeout(timer);
        }

        // Boot finished, auto-execute profile fetch
        const timer = setTimeout(() => {
            setBooting(false);
            runBootCommand();
        }, 800);
        return () => clearTimeout(timer);
    }, [bootLineIndex, booting]);

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
