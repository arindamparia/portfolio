import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { UAParser } from 'ua-parser-js';
import { sql } from './src/config/database.js';
import { validateContactData, parseUserAgent, sanitizeContactData } from './src/utils/contactValidation.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS with allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { userAgent } = req.body;

        // Validate contact data
        const validation = validateContactData(req.body);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        // Get client IP address (handle proxy scenarios)
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
                         req.headers['x-real-ip'] ||
                         req.socket.remoteAddress ||
                         req.ip;

        // Parse user agent to extract browser, OS, and device information
        const parser = new UAParser(userAgent);
        const { browser, os, deviceType } = parseUserAgent(parser);

        // Sanitize data for database insertion
        const sanitized = sanitizeContactData(req.body);

        // Insert into database with comprehensive user tracking
        const result = await sql`
            INSERT INTO contacts (
                salutation, first_name, last_name, email, mobile, company, message,
                ip_address, user_agent, browser, operating_system, device_type,
                screen_resolution, language, timezone, referrer
            )
            VALUES (
                ${sanitized.salutation},
                ${sanitized.firstName},
                ${sanitized.lastName},
                ${sanitized.email},
                ${sanitized.mobile},
                ${sanitized.company},
                ${sanitized.message},
                ${ipAddress},
                ${sanitized.userAgent},
                ${browser},
                ${os},
                ${deviceType},
                ${sanitized.screenResolution},
                ${sanitized.language},
                ${sanitized.timezone},
                ${sanitized.referrer}
            )
            RETURNING id, salutation, first_name, last_name, email, mobile, company,
                     ip_address, browser, operating_system, device_type, created_at
        `;

        return res.status(201).json({
            success: true,
            message: 'Contact information saved successfully',
            data: result[0]
        });

    } catch (error) {
        console.error('Error saving contact:', error);

        // Only expose error details in development
        const response = {
            error: 'Failed to save contact information'
        };

        if (process.env.NODE_ENV === 'development') {
            response.details = error.message;
        }

        return res.status(500).json(response);
    }
});

// NOTE: /api/contacts endpoint removed for security
// If you need to view contacts, query the database directly or implement proper authentication

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`  - POST http://localhost:${PORT}/api/contact`);
});
