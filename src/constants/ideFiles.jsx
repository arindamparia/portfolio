import { FaReact, FaJs, FaCss3, FaMarkdown } from 'react-icons/fa';
import { SiJson } from 'react-icons/si';

// Shared file list for IDE components (Sidebar and Tabs)
export const ideFiles = [
    { name: 'home.jsx', icon: <FaReact color="#61DAFB" />, id: 'home' },
    { name: 'projects.js', icon: <FaJs color="#F7DF1E" />, id: 'projects' },
    { name: 'experience.json', icon: <SiJson color="#F7DF1E" />, id: 'experience' },
    { name: 'skills.json', icon: <SiJson color="#F7DF1E" />, id: 'skills' },
    { name: 'education.md', icon: <FaMarkdown color="#42A5F5" />, id: 'education' },
    { name: 'certifications.json', icon: <SiJson color="#F7DF1E" />, id: 'certifications' },
    { name: 'contact.css', icon: <FaCss3 color="#42A5F5" />, id: 'contact' },
];
