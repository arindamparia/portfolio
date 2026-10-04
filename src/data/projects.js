/**
 * Personal Projects Data
 *
 * Collection of side projects and personal work including:
 * - Project name and description
 * - Technologies used
 * - Project type (Web App, Automation, Extension, etc.)
 * - featured: shown as the case study next to the sorting demo
 * - earlier: college-era projects, listed compactly
 *
 * Displayed in the Projects section of the Modern, IDE and hacker views
 */

export const projectsData = [
    {
        name: 'AlgoTracker',
        description: 'A full-stack, AI-first DSA preparation tool: track LeetCode problems, run mock interviews, review with spaced repetition, and get AI feedback on your code.',
        tech: ['Vanilla JS', 'Motion One', 'Netlify Serverless', 'Neon PostgreSQL', 'Clerk Auth', 'OpenAI API'],
        type: 'Web App',
        live: 'https://algotracker.xyz',
        github: 'https://github.com/arindamparia/dsa-tracker',
        image: '/images/algotracker-1200.jpg',
        featured: true
    },
    {
        name: 'DailyAlign',
        description: 'A daily habit, workout, nutrition and hydration tracker. It works offline, syncs live between devices, signs in with passkeys, and has a native Android app.',
        tech: ['React', 'Cloudflare Pages Functions', 'Cloudflare D1', 'Pusher', 'WebAuthn passkeys', 'Flutter'],
        type: 'Web App',
        live: 'https://dailyalign.pages.dev',
        liveLabel: 'Open app (sign-in required)'
    },
    {
        name: 'True Salary Calculator',
        description: 'Works out take-home pay and income tax from current tax slabs for eight countries, including India, the UK, Germany and Japan. Everything is calculated in the browser.',
        tech: ['Astro', 'Preact', 'Tailwind', 'Cloudflare Pages', 'Cloudflare D1', 'Satori'],
        type: 'Web App',
        live: 'https://truesalarycalculator.com'
    },
    {
        name: 'Blogify',
        description: 'Platform for college students to post interview experiences.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MongoDB'],
        type: 'Web App',
        github: 'https://github.com/arindamparia/Blogify',
        earlier: true
    },
    {
        name: 'Notice Reminder',
        description: 'Automated email notifications for college notices.',
        tech: ['Python', 'Selenium'],
        type: 'Automation',
        github: 'https://github.com/arindamparia/NoticeReminderNITDGP',
        earlier: true
    },
    {
        name: 'Modern Learning',
        description: '3D learning experience using AR/VR on the web.',
        tech: ['HTML', 'JavaScript', 'Howler.js', 'AR.js'],
        type: 'Web App',
        github: 'https://github.com/arindamparia/Modern-Learning',
        earlier: true
    },
    {
        name: 'Revision Reminder',
        description: 'Chrome extension for spaced repetition revision.',
        tech: ['Node.js', 'Express', 'MongoDB', 'Python'],
        type: 'Extension',
        github: 'https://github.com/arindamparia/RevisionReminder',
        earlier: true
    }
];
