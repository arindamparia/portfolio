// Personal Information Constants
export const personalInfo = {
    name: {
        first: 'Arindam',
        last: 'Paria',
        full: 'Arindam Paria',
        initials: 'AP'
    },
    title: 'Software Engineer',
    location: 'India',
    email: 'arindamparia321@gmail.com',
    phone: '+91 9064175719',
    greeting: "Hello, I'm",
    pitch: 'I build bug-free backends.',
    pitchAside: 'At least, I try to. The NFRs always pass, the algorithms are optimal, and the bugs get rarer every sprint.',
    status: 'Open to opportunities',
    about: 'Passionate software engineer with expertise in building scalable applications and solving complex problems. Experienced in Java, Spring Boot, Salesforce Commerce Cloud, and Modern Web Technologies.'
};

// Social Media Links
export const socialLinks = {
    github: {
        url: 'https://github.com/arindamparia',
        username: 'arindamparia',
        label: 'GitHub'
    },
    linkedin: {
        url: 'https://www.linkedin.com/in/arindam-paria-557170191/',
        username: 'arindam-paria-557170191',
        label: 'LinkedIn'
    },
    leetcode: {
        url: 'https://leetcode.com/u/ARINDAM9064/',
        username: 'ARINDAM9064',
        label: 'LeetCode'
    },
    algotracker: {
        url: import.meta.env.VITE_DSA_TRACKER_URL || 'https://algotracker.xyz',
        label: 'AlgoTracker'
    }
};

export const assets = {
    // Self-hosted 600×750 crop (the Cloudinary account blocks on-the-fly resizing; the original is 2.2 MB)
    aboutImage: '/images/about-600.jpg',
    profileImage: '/images/profile-600.jpg',
    // Set to '/cv.pdf' once public/cv.pdf exists; the Download CV button is hidden while this is null
    cvPath: null
};
