import { neon } from '@neondatabase/serverless';
import { UAParser } from 'ua-parser-js';
import { validateContactData, parseUserAgent, sanitizeContactData } from '../../src/utils/contactValidation.js';

// Neon database connection
const sql = neon(process.env.DATABASE_URL);

export default async (req, context) => {
    // Get allowed origins from environment variable
    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
        : [];

    const origin = req.headers.get('origin');

    // CORS Logic:
    // 1. If no origin header: Allow (same-origin request or tools like Postman)
    // 2. If origin header exists AND ALLOWED_ORIGINS is empty: REJECT (misconfiguration)
    // 3. If origin header exists: Only allow if in allowedOrigins list
    let isAllowedOrigin = false;
    let corsOrigin = 'null';

    if (!origin) {
        // No origin header - likely same-origin request
        isAllowedOrigin = true;
        corsOrigin = '*';
    } else if (allowedOrigins.length === 0) {
        // Cross-origin request but ALLOWED_ORIGINS not configured - REJECT for security
        isAllowedOrigin = false;
        corsOrigin = 'null';
    } else if (allowedOrigins.includes(origin)) {
        // Origin is in allowed list
        isAllowedOrigin = true;
        corsOrigin = origin;
    } else {
        // Origin not in allowed list - REJECT
        isAllowedOrigin = false;
        corsOrigin = 'null';
    }

    // Set CORS headers with restricted origin
    const headers = {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    // Reject if origin is not allowed (only for cross-origin requests)
    if (origin && !isAllowedOrigin) {
        return new Response(
            JSON.stringify({ error: `Origin ${origin} not allowed by CORS policy` }),
            { status: 403, headers }
        );
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

        // Only return minimal data (don't return user's PII back to them)
        return new Response(
            JSON.stringify({
                success: true,
                message: 'Contact information saved successfully',
                id: result[0].id
            }),
            { status: 201, headers }
        );

    } catch (error) {
        console.error('Error saving contact:', error);

        // Only expose error details in development
        const response = {
            error: 'Failed to save contact information'
        };

        // Netlify sets NODE_ENV automatically
        if (process.env.NODE_ENV === 'development' || process.env.CONTEXT === 'dev') {
            response.details = error.message;
        }

        return new Response(
            JSON.stringify(response),
            { status: 500, headers }
        );
    }
};

export const config = {
    path: '/api/contact'
};
