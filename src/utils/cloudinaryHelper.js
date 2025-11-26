import cld from '../config/cloudinary';

/**
 * Get optimized Cloudinary image URL
 *
 * @param {string} publicId - The public ID of your uploaded image (e.g., "profile/my-photo")
 * @param {Object} options - Transformation options
 * @param {number} options.width - Desired width
 * @param {number} options.height - Desired height
 * @param {string} options.crop - Crop mode: 'fill', 'fit', 'scale', 'thumb'
 * @param {string} options.quality - Quality: 'auto', 'auto:best', 'auto:good', 'auto:eco', 'auto:low'
 * @param {string} options.format - Format: 'auto', 'jpg', 'png', 'webp'
 * @returns {string} Optimized Cloudinary URL
 *
 * @example
 * // Profile image with auto optimization
 * getCloudinaryUrl('profile/my-photo', { width: 400, height: 400, crop: 'fill' })
 *
 * // About image
 * getCloudinaryUrl('about/image', { width: 300, height: 400 })
 */
export const getCloudinaryUrl = (publicId, options = {}) => {
  const {
    width = 400,
    height = 400,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;

  try {
    const image = cld.image(publicId);

    // Apply transformations
    image
      .resize(`c_${crop},w_${width},h_${height}`)
      .quality(quality)
      .format(format);

    return image.toURL();
  } catch (error) {
    console.error('Error generating Cloudinary URL:', error);
    return `https://via.placeholder.com/${width}x${height}`;
  }
};

/**
 * Direct Cloudinary URL builder (simple method)
 *
 * @param {string} cloudName - Your Cloudinary cloud name
 * @param {string} publicId - The public ID of your uploaded image
 * @param {Object} options - Transformation options
 * @returns {string} Cloudinary URL
 *
 * @example
 * buildCloudinaryUrl('my_cloud', 'profile/my-photo', { width: 400, height: 400 })
 */
export const buildCloudinaryUrl = (cloudName, publicId, options = {}) => {
  const {
    width = 400,
    height = 400,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;

  return `https://res.cloudinary.com/${cloudName}/image/upload/c_${crop},w_${width},h_${height},q_${quality},f_${format}/${publicId}`;
};
