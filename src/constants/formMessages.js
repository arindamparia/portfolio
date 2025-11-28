/**
 * Comprehensive collection of sarcastic and funny messages for all form fields
 * Includes both error messages and success messages for better UX
 */

export const formMessages = {
    // ==================== SALUTATION ====================
    salutation: {
        required: [
            "Pick a title! Mr? Ms? Mrs? Or are you royalty? 👑",
            "Salutation required! How should I address you? 🎩",
            "Choose your title! Don't be shy! 😊",
            "Select one! Even superheroes have titles! 🦸",
            "Mr, Ms, or Mrs? Pick your fighter! 🥊",
            "A salutation would be nice! Are you a Sir or Madam? 🎭",
            "Title please! I need to know how formal to be! 📜"
        ],
        success: [
            "Perfect title! Nice to meet you! 🎩",
            "Great choice! Now I know how to address you! ✨",
            "Excellent! Formalities covered! 👌",
            "Nice pick! Very distinguished! 🌟"
        ]
    },

    // ==================== FIRST NAME ====================
    firstName: {
        required: [
            "Your name is required, unless you're a secret agent 🕵️",
            "Come on, even anonymous users have names!",
            "First name? Or should I call you 'User123'?",
            "I promise I won't sell your name... probably 😏",
            "Who are you? A ghost? 👻 Names required!",
            "First name please! Even superheroes have alter egos!",
            "No name, no game! Well... no submission actually 🎮",
            "Your name won't bite. Mine might, but yours won't! 🐺"
        ],
        tooShort: [
            "That's a bit short, isn't it? Are you a spy? 🕶️",
            "3 characters minimum! This isn't Twitter 🐦",
            "Your name is longer than that... right? 🤔",
            "Come on, even 'Bob' has 3 letters! Try harder! 💪",
            "Is that a name or a typo? Need at least 3 chars!",
            "Short and sweet, but TOO short! 3+ letters please! 📏",
            "That's an abbreviation, not a name! More please! 🔤"
        ],
        invalid: [
            "Letters only please! Numbers belong in passwords 🔢",
            "Is that really your name? Seems kinda... digital 🤖",
            "Nice try, but emojis aren't names... yet 😅",
            "Your name has numbers? Are you from The Matrix? 💊",
            "A-Z only! Save the creativity for your message! 🎨",
            "Letters! Just letters! Not rocket science! 🚀",
            "Is your name really '123'? I don't think so! 🎭"
        ],
        success: [
            "Perfect! That's a valid name! 🎉",
            "Great name! Your parents chose well! 👏",
            "Lovely! Now I know what to call you! ✨",
            "Excellent! That actually looks like a name! 🌟",
            "Nice! Simple, clean, perfect! 💯",
            "Beautiful name! Let's continue! 🎊",
            "Fantastic! One field down! 🏆",
            "That's a name I can work with! 😊"
        ]
    },

    // ==================== LAST NAME ====================
    lastName: {
        required: [
            "Last name too! Don't be shy 😊",
            "One name isn't enough, you're not Madonna!",
            "Surname please? Or are you royalty? 👑",
            "Your last name won't bite, I promise!",
            "Full name = Full respect! Give me that surname! 🎩",
            "Come on, complete the name puzzle! 🧩",
            "Last name required! You're not Beyoncé! 💃",
            "Finishing strong with that last name please! 🏁"
        ],
        tooShort: [
            "Your surname is longer than 2 letters, trust me! 📝",
            "That's not a full surname! 3+ characters please! 🎯",
            "Too short! Even 'Kim' has 3 letters! Wait... 🤔",
            "Expand on that! We need at least 3 letters! 📏",
            "Your surname deserves better! Give it 3+ letters! 💪",
            "Short surnames are cool, but need 3 minimum! ✨",
            "Is that the whole thing? Need a bit more! 📖"
        ],
        invalid: [
            "Surnames don't have numbers... unless you're a robot? 🤖",
            "Letters only! Your surname isn't a password! 🔐",
            "Special characters in surnames? Living in 2077? 🚀",
            "Just letters please! Keep it simple! 🔤",
            "Is that a surname or a code? Letters only! 💻",
            "Alpha characters only! No digits in names! 🔡",
            "That's creative, but surnames are just letters! 🎨"
        ],
        success: [
            "Awesome! Complete name acquired! 🎯",
            "Perfect surname! You're on a roll! 🎲",
            "Great! Now I can address you properly! 🎩",
            "Excellent! That's a solid last name! 💪",
            "Beautiful! The name is complete! ✨",
            "Fantastic! Your identity is confirmed! 🎭",
            "Lovely! Moving right along! 🚀",
            "Nice surname! Parents nailed it! 👌"
        ]
    },

    // ==================== EMAIL ====================
    email: {
        required: [
            "Email please! Carrier pigeons are so last century 🐦",
            "How else will I spam... I mean, contact you? 📧",
            "No email = no reply. Simple math! 🤷",
            "Your email address, please? I left my crystal ball at home 🔮",
            "Email needed! Telepathy isn't in my job description! 🧠",
            "Give me that email! I promise to guard it... maybe 😇",
            "Email required! Smoke signals are unreliable! 💨",
            "Where should I send my reply? Your email please! 📬"
        ],
        invalid: [
            "That email looks faker than my enthusiasm on Monday mornings ☕",
            "Please enter a REAL email address. I'm begging you 🙏",
            "Email format: something@somewhere.com. You got this! 💡",
            "Did you just keyboard-smash? That's not an email! ⌨️",
            "Invalid email! Did autocorrect betray you? 🤖",
            "That's not how emails work! Need the @ and stuff! 📧",
            "Email 101: text@domain.extension. Try again! 🎓",
            "Is that an email or abstract art? Fix it please! 🎨",
            "System says: 'That's not an email!' 🚨",
            "Nice try, but emails need @ and dots! 📍"
        ],
        success: [
            "Great! That's a valid email! 📧",
            "Perfect! I can reach you now! ✉️",
            "Excellent email! Looks legit! ✅",
            "Nice! That's an actual email address! 🎯",
            "Beautiful! Email verified! 💌",
            "Fantastic! Now we can communicate! 📬",
            "That works! Good job! 👏",
            "Valid email detected! You're a pro! 🌟"
        ]
    },

    // ==================== PHONE ====================
    phone: {
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
        lengthError: [
            "10 digits please! Not 9, not 11... exactly 10! 🔟",
            "Count with me: 1, 2, 3... up to 10! Is that so hard? 🤔",
            "That's either a landline or your password. Need 10 digits! 🔢",
            "10 digits! This isn't a PIN code or a phone number from the '80s! 📞",
            "Too short! That's what she... I mean, we need 10 digits! 😅",
            "Is this a phone number or a lucky number? Need exactly 10! 🍀",
            "10 digits! Not your age, not your IQ, your phone number! 🤓",
            "Exactly 10! Not close to 10, exactly 10! 🎯"
        ],
        invalidCharacters: [
            "Numbers only please! Letters belong in your name, not your phone! 🔤",
            "Did you just try to spell your number? Nice try! 😏",
            "Phone numbers: 100% numbers, 0% creativity. Just digits! 🎯",
            "Emojis in phone numbers? Living in 3023 I see! But... no. 🚀",
            "Special characters? This isn't a password reset! Just 0-9! 🔐",
            "Letters? What is this, binary code? Numbers only! 💻",
            "Digits! D-I-G-I-T-S! Just 0-9 please! 🔢"
        ],
        invalidPrefix: [
            "Indian mobile numbers start with 6, 7, 8, or 9! Basic stuff! 📱",
            "That prefix doesn't exist! Did you just make up a number? 🎭",
            "Starting with what now? Indian mobiles begin with 6-9! 🇮🇳",
            "Nice try! But Indian numbers start with 6, 7, 8, or 9! 🎲",
            "That's not how Indian numbers work! Start with 6-9! 📞",
            "Wrong prefix alert! 🚨 Must start with 6, 7, 8, or 9!",
            "0, 1, 2, 3, 4, 5? Nope! Try 6, 7, 8, or 9 instead! 🔢",
            "Is this a number from another dimension? Need 6-9 start! 🌌",
            "Invalid first digit! Indian mobiles: 6, 7, 8, or 9! 🇮🇳"
        ],
        success: [
            "Excellent! That's a valid Indian number! 🎉",
            "Perfect! I won't call at 2 AM... probably! 😇",
            "Great number! Looks legit! 📱",
            "Nice! That's a real mobile number! ✅",
            "Fantastic! Now I can WhatsApp... I mean, call you! 💬",
            "Valid number detected! You nailed it! 🎯",
            "That works! Good job! 👏",
            "Beautiful! That's a proper Indian mobile! 🇮🇳"
        ]
    },

    // ==================== MESSAGE ====================
    message: {
        required: [
            "Message field is emptier than my fridge! 🍕",
            "Say something! Anything! Even 'Hi' works! 👋",
            "10 characters minimum. You can do better than 'ok' 💪",
            "Don't leave me hanging! Type something interesting 🎭",
            "The silence is deafening! Write something! 🔇",
            "Empty message? Did your keyboard break? ⌨️",
            "Come on, tell me something! I'm all ears! 👂",
            "Message required! This isn't mime class! 🤐"
        ],
        tooShort: [
            "10+ characters please! Use your words! 📝",
            "That's too short! Elaborate please! 🎯",
            "Come on, give me at least 10 characters! Try harder! 💪",
            "Your message deserves more! 10+ chars minimum! 📏",
            "Too brief! I need context! Write more! 🎨",
            "Short messages are cute, but need 10+ characters! 💌",
            "Expand on that! Tell me more! 10+ letters! 📖",
            "That's a tweet, not a message! More please! 🐦",
            "10+ characters! Don't be shy, type away! ⌨️"
        ],
        success: [
            "Looking forward to reading this! 🎉",
            "Perfect! That's a solid message! 📝",
            "Excellent! You've got my attention! 👀",
            "Great message! I can't wait to respond! 💬",
            "Fantastic! Now we're talking! 🗣️",
            "Nice! That's what I call a proper message! ✨",
            "Beautiful! You express yourself well! 🎭",
            "Love it! Clear and informative! 💯"
        ]
    },

    // ==================== GENERAL FORM ====================
    form: {
        submitError: [
            "Oops! Some fields need your attention 🤦",
            "Hold up! Fix those red fields first! 🚨",
            "Not so fast! Some errors need fixing! 🐌",
            "Error alert! Check the angry red messages! 🔴",
            "Whoa there! We've got validation issues! ⚠️",
            "Almost! Just fix those highlighted fields! 🎯",
            "So close! Address those errors first! 🏁"
        ],
        submitSuccess: [
            "🎉 Success! Your message was sent. I'll get back to you faster than you can say 'JavaScript'!",
            "🚀 Boom! Message delivered! Expect a reply soon!",
            "✨ Perfect! Your message is on its way to my inbox!",
            "🎊 Sent! I'll read this ASAP! Thanks for reaching out!",
            "💌 Message received! I'll respond quicker than a async function!",
            "🏆 Success! Your message is now in my priority queue!",
            "⚡ Sent! Faster than a speed of light! Well, almost! 😅"
        ],
        networkError: [
            "Network error! Check if the server is running, or if your internet is just playing hide and seek 🙈",
            "Connection failed! Is your WiFi taking a nap? 😴",
            "Oops! Network hiccup! Try again in a moment! 🌐",
            "Server said 'not now'! Check your connection! 📡",
            "Network gremlins detected! Please try again! 👾"
        ]
    }
};

/**
 * Get a random message from a specific field and category
 * @param {string} field - The form field (firstName, lastName, email, phone, message, form)
 * @param {string} category - The message category (required, invalid, success, etc.)
 * @returns {string} - A random message
 */
export const getRandomMessage = (field, category) => {
    try {
        const messages = formMessages[field]?.[category];
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.warn(`No messages found for ${field}.${category}`);
            return 'Please check this field'; // Fallback
        }
        return messages[Math.floor(Math.random() * messages.length)];
    } catch (error) {
        console.error('Error getting random message:', error);
        return 'Please check this field'; // Fallback
    }
};

/**
 * Legacy support - Get a random phone error message
 * @param {string} category - The error category
 * @returns {string} - A random error message
 */
export const getRandomPhoneError = (category) => {
    return getRandomMessage('phone', category);
};

/**
 * Get a random success message for any field
 * @param {string} field - The form field
 * @returns {string} - A random success message
 */
export const getRandomSuccess = (field) => {
    return getRandomMessage(field, 'success');
};

/**
 * Get all messages for a specific field (useful for testing)
 * @param {string} field - The form field
 * @returns {object} - All messages for that field
 */
/**
 * Sarcastic and funny placeholders for the message field
 * Rotates between "About You" and "Why Connect" themes
 */
export const messagePlaceholders = [
    // Theme: Why connect?
    "Why do you want to connect? To give me money? 💰 (Just kidding... unless?)",
    "Is it a bug? A feature? A job offer? A pizza delivery? 🍕",
    "Spill the tea ☕. Why are we connecting today?",
    "What brings you to my humble digital abode? 🏰",
    "I bet you have a great idea. Don't keep it a secret! 🤫",
    "Are you here to recruit me, or just to say hi? I accept both! 👋",
    "Tell me why I should reply to you faster than my other emails... 🏎️",
    "Is this about a project? Or do you just like my website? (Say yes) 😎",
    "I'm listening... well, reading. Impress me! 🤓",
    "Got a challenge for me? Bring it on! ⚔️",

    // Theme: About You
    "Tell me your life story... or just the highlights. 📜",
    "Share a fun fact about you. If it's good, I might reply faster! ⚡",
    "Tell me why you're awesome. I need some inspiration today. ✨",
    "Don't be shy, I don't bite. Much. 🧛‍♂️",
    "What's your superpower? Mine is coding (and drinking coffee). ☕",
    "Tell me something I don't know. Surprise me! 🎁",
    "If you were a coding language, which one would you be and why? 🤔",
    "Describe yourself in 3 words. Go! 🏁",
    "What's the coolest thing you've built recently? 🏗️",
    "Are you a robot? 🤖 If not, say something human."
];

/**
 * Get a random message placeholder
 * @returns {string} - A random placeholder message
 */
export const getRandomPlaceholder = () => {
    return messagePlaceholders[Math.floor(Math.random() * messagePlaceholders.length)];
};
