/**
 * IDE Files Configuration
 *
 * Defines the "files" shown in the VS Code-style file explorer.
 * Each file represents a different section of the portfolio.
 *
 * Properties:
 * - name: Display name with file extension (for visual effect)
 * - icon: React icon component with appropriate color
 * - id: Unique identifier used for routing/navigation
 *
 * File extensions are chosen to match common file types for visual appeal:
 * - .jsx for React components
 * - .js for JavaScript logic
 * - .json for data
 * - .md for documentation-style content
 * - .css for styling sections
 *
 * Used by IDE Sidebar and Tabs components
 */

import { FaReact, FaJs, FaCss3, FaMarkdown } from 'react-icons/fa';
import { SiJson } from 'react-icons/si';

export const ideFiles = [
    { name: 'home.jsx', icon: <FaReact color="#61DAFB" />, id: 'home' },
    { name: 'projects.js', icon: <FaJs color="#F7DF1E" />, id: 'projects' },
    { name: 'experience.json', icon: <SiJson color="#F7DF1E" />, id: 'experience' },
    { name: 'skills.json', icon: <SiJson color="#F7DF1E" />, id: 'skills' },
    { name: 'education.md', icon: <FaMarkdown color="#42A5F5" />, id: 'education' },
    { name: 'certifications.json', icon: <SiJson color="#F7DF1E" />, id: 'certifications' },
    { name: 'contact.css', icon: <FaCss3 color="#42A5F5" />, id: 'contact' },
];
