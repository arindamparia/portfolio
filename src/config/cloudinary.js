import { Cloudinary } from '@cloudinary/url-gen';

/**
 * Cloudinary Configuration
 *
 * Setup Instructions:
 * 1. Sign up for free at https://cloudinary.com
 * 2. Get your cloud name from the dashboard
 * 3. Replace 'your_cloud_name' below with your actual cloud name
 *
 * To upload your profile picture:
 * 1. Log into Cloudinary dashboard
 * 2. Go to Media Library
 * 3. Upload your image
 * 4. Copy the Public ID (e.g., "profile/my-photo")
 * 5. Use that Public ID in personalInfo.js
 */

// Initialize Cloudinary instance
// Replace 'your_cloud_name' with your actual Cloudinary cloud name
const cld = new Cloudinary({
  cloud: {
    cloudName: 'your_cloud_name' // TODO: Replace with your cloud name
  }
});

export default cld;
