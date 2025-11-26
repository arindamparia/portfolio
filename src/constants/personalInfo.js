// Personal Information Constants
export const personalInfo = {
    name: {
        first: 'Arindam',
        last: 'Paria',
        full: 'Arindam Paria',
        initials: 'AP'
    },
    title: 'Software Engineer',
    email: 'arindamparia321@gmail.com',
    phone: '+91 9064175719',
    greeting: "Hello, I'm",
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
    }
};

// Assets
export const assets = {
    // ==============================================================
    // CLOUDINARY SETUP INSTRUCTIONS:
    // ==============================================================
    // 1. Sign up for free at https://cloudinary.com
    // 2. Upload your profile picture to Cloudinary Media Library
    // 3. Copy the "Public ID" (e.g., "portfolio/profile-pic")
    // 4. Get your "Cloud Name" from dashboard
    // 5. Replace the URLs below using one of these methods:
    //
    // METHOD 1 - Direct URL (Recommended - Simple):
    // profileImage: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/c_fill,w_400,h_400,q_auto,f_auto/YOUR_PUBLIC_ID'
    //
    // METHOD 2 - Using helper function:
    // import { buildCloudinaryUrl } from '../utils/cloudinaryHelper';
    // profileImage: buildCloudinaryUrl('YOUR_CLOUD_NAME', 'YOUR_PUBLIC_ID', { width: 400, height: 400 })
    //
    // EXAMPLE:
    // If your cloud name is "demo" and public ID is "portfolio/arindam-photo"
    // profileImage: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_400,h_400,q_auto,f_auto/portfolio/arindam-photo'
    // ==============================================================

    profileImage: 'https://via.placeholder.com/400', // TODO: Replace with your Cloudinary URL
    aboutImage: 'https://via.placeholder.com/300x400', // TODO: Replace with your Cloudinary URL
    cvPath: '/cv.pdf'
};
