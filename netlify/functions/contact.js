import { neon } from '@neondatabase/serverless';
import { UAParser } from 'ua-parser-js';
import { validateContactData, parseUserAgent, sanitizeContactData } from '../../src/utils/contactValidation.js';

// Neon database connection
const sql = neon(process.env.DATABASE_URL);

export default async (req, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers }
        );
    }

    try {
        const body = await req.json();
        const { userAgent } = body;

        // Validate contact data
        const validation = validateContactData(body);
        if (!validation.valid) {
            return new Response(
                JSON.stringify({ error: validation.error }),
                { status: 400, headers }
            );
        }

        // Get client IP address
        const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                         req.headers.get('x-real-ip') ||
                         context.ip ||
                         'unknown';

        // Parse user agent to extract browser, OS, and device information
        const parser = new UAParser(userAgent);
        const { browser, os, deviceType } = parseUserAgent(parser);

        // Sanitize data for database insertion
        const sanitized = sanitizeContactData(body);

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

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Contact information saved successfully',
                data: result[0]
            }),
            { status: 201, headers }
        );

    } catch (error) {
        console.error('Error saving contact:', error);
        return new Response(
            JSON.stringify({
                error: 'Failed to save contact information',
                details: error.message
            }),
            { status: 500, headers }
        );
    }
};

export const config = {
    path: '/api/contact'
};
