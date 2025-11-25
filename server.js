import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { UAParser } from 'ua-parser-js';
import { sql } from './src/config/database.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const {
            salutation,
            firstName,
            lastName,
            userAgent,
            language,
            screenResolution,
            timezone,
            referrer
        } = req.body;

        // Get client IP address (handle proxy scenarios)
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
                         req.headers['x-real-ip'] ||
                         req.socket.remoteAddress ||
                         req.ip;

        // Parse user agent to extract browser, OS, and device information
        const parser = new UAParser(userAgent);
        const uaResult = parser.getResult();

        const browser = uaResult.browser.name ?
                       `${uaResult.browser.name} ${uaResult.browser.version || ''}`.trim() :
                       'Unknown';
        const os = uaResult.os.name ?
                  `${uaResult.os.name} ${uaResult.os.version || ''}`.trim() :
                  'Unknown';
        const deviceType = uaResult.device.type || 'desktop';

        // Validate required fields
        if (!firstName || !lastName) {
            return res.status(400).json({
                error: 'First name and last name are required'
            });
        }

        // Validate field lengths
        if (firstName.trim().length < 3) {
            return res.status(400).json({
                error: 'First name must be at least 3 characters'
            });
        }

        if (lastName.trim().length < 3) {
            return res.status(400).json({
                error: 'Last name must be at least 3 characters'
            });
        }

        // Validate only letters in names
        if (!/^[A-Za-z\s]+$/.test(firstName) || !/^[A-Za-z\s]+$/.test(lastName)) {
            return res.status(400).json({
                error: 'Names should only contain letters'
            });
        }

        // Insert into database with comprehensive user tracking
        const result = await sql`
            INSERT INTO contacts (
                salutation, first_name, last_name, ip_address,
                user_agent, browser, operating_system, device_type,
                screen_resolution, language, timezone, referrer
            )
            VALUES (
                ${salutation || null},
                ${firstName.trim()},
                ${lastName.trim()},
                ${ipAddress},
                ${userAgent || null},
                ${browser},
                ${os},
                ${deviceType},
                ${screenResolution || null},
                ${language || null},
                ${timezone || null},
                ${referrer || null}
            )
            RETURNING id, salutation, first_name, last_name, ip_address,
                     browser, operating_system, device_type, created_at
        `;

        return res.status(201).json({
            success: true,
            message: 'Contact information saved successfully',
            data: result[0]
        });

    } catch (error) {
        console.error('Error saving contact:', error);
        return res.status(500).json({
            error: 'Failed to save contact information',
            details: error.message
        });
    }
});

// Get all contacts (for testing/admin purposes)
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await sql`
            SELECT id, salutation, first_name, last_name, ip_address,
                   user_agent, browser, operating_system, device_type,
                   screen_resolution, language, timezone, referrer, created_at
            FROM contacts
            ORDER BY created_at DESC
        `;

        return res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });

    } catch (error) {
        console.error('Error fetching contacts:', error);
        return res.status(500).json({
            error: 'Failed to fetch contacts',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`  - POST http://localhost:${PORT}/api/contact`);
    console.log(`  - GET  http://localhost:${PORT}/api/contacts`);
});
