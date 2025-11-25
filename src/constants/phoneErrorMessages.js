/**
 * Sarcastic and funny error messages for phone number validation
 * Randomly select from these arrays for entertainment value
 */

export const phoneErrorMessages = {
    // When phone number is empty
    required: [
        "Phone number? Don't worry, I won't call at 3 AM... maybe 😈",
        "10 digits please! Your cat's paws won't work here 🐱",
        "A valid number would be nice, unlike my life choices 📱",
        "Mobile number required! Smoke signals don't count 💨",
        "No number = no contact. I don't have telepathy... yet 🧠",
        "Come on, even Batman gives his number... to Alfred 🦇",
        "Phone number please? I left my mind-reading device at home 🔮",
        "Your digits or it didn't happen! 🎲"
    ],

    // When number is not 10 digits
    lengthError: [
        "10 digits please! Not 9, not 11... exactly 10! 🔟",
        "Count with me: 1, 2, 3... up to 10! Is that so hard? 🤔",
        "That's either a landline or your password. Need 10 digits! 🔢",
        "10 digits! This isn't a PIN code or a phone number from the '80s! 📞",
        "Too short! That's what she... I mean, we need 10 digits! 😅",
        "Is this a phone number or a lucky number? Need exactly 10! 🍀",
        "10 digits! Not your age, not your IQ, your phone number! 🤓"
    ],

    // When number has non-digit characters
    invalidCharacters: [
        "Numbers only please! Letters belong in your name, not your phone! 🔤",
        "Did you just try to spell your number? Nice try! 😏",
        "Phone numbers: 100% numbers, 0% creativity. Just digits! 🎯",
        "Emojis in phone numbers? Living in 3023 I see! But... no. 🚀",
        "Special characters? This isn't a password reset! Just 0-9! 🔐",
        "Letters? What is this, binary code? Numbers only! 💻"
    ],

    // When number doesn't start with 6-9
    invalidPrefix: [
        "Indian mobile numbers start with 6, 7, 8, or 9! Basic stuff! 📱",
        "That prefix doesn't exist! Did you just make up a number? 🎭",
        "Starting with what now? Indian mobiles begin with 6-9! 🇮🇳",
        "Nice try! But Indian numbers start with 6, 7, 8, or 9! 🎲",
        "That's not how Indian numbers work! Start with 6-9! 📞",
        "Wrong prefix alert! 🚨 Must start with 6, 7, 8, or 9!",
        "0, 1, 2, 3, 4, 5? Nope! Try 6, 7, 8, or 9 instead! 🔢",
        "Is this a number from another dimension? Need 6-9 start! 🌌"
    ],

    // General invalid format
    invalidFormat: [
        "That doesn't look like a valid Indian number 🇮🇳",
        "Hmm... are you sure that's a real number? Looks sus 🤨",
        "Invalid format! Did you roll dice for this number? 🎲",
        "That number is faker than my confidence on Mondays ☕",
        "System says: 'Nope!' Try a real Indian mobile number! 🚫",
        "Error 404: Valid phone number not found! 🔍"
    ],

    // Success messages (bonus!)
    success: [
        "Perfect! That's a valid number! 🎉",
        "Excellent! Now I can spam... I mean, contact you! 😇",
        "Great! This number actually exists in this universe! 🌟",
        "Valid number detected! My validation skills are on point! 💪",
        "Success! You've mastered the art of 10-digit entry! 🏆",
        "That's a real number! Unlike my chances of winning the lottery! 🎰"
    ]
};

/**
 * Get a random error message from a category
 * @param {string} category - The error category
 * @returns {string} - A random error message
 */
export const getRandomPhoneError = (category) => {
    const messages = phoneErrorMessages[category];
    if (!messages || messages.length === 0) {
        return 'Invalid phone number'; // Fallback
    }
    return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Get a random success message
 * @returns {string} - A random success message
 */
export const getRandomPhoneSuccess = () => {
    return getRandomPhoneError('success');
};
