import { neon } from '@neondatabase/serverless';
import { UAParser } from 'ua-parser-js';

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
        const {
            salutation,
            firstName,
            lastName,
            email,
            mobile,
            company,
            message,
            userAgent,
            language,
            screenResolution,
            timezone,
            referrer
        } = body;

        // Get client IP address
        const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                         req.headers.get('x-real-ip') ||
                         context.ip ||
                         'unknown';

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
        if (!firstName || !lastName || !email || !mobile || !message) {
            return new Response(
                JSON.stringify({ error: 'First name, last name, email, mobile, and message are required' }),
                { status: 400, headers }
            );
        }

        // Validate field lengths
        if (firstName.trim().length < 3) {
            return new Response(
                JSON.stringify({ error: 'First name must be at least 3 characters' }),
                { status: 400, headers }
            );
        }

        if (lastName.trim().length < 3) {
            return new Response(
                JSON.stringify({ error: 'Last name must be at least 3 characters' }),
                { status: 400, headers }
            );
        }

        if (message.trim().length < 10) {
            return new Response(
                JSON.stringify({ error: 'Message must be at least 10 characters' }),
                { status: 400, headers }
            );
        }

        // Validate only letters in names
        if (!/^[A-Za-z\s]+$/.test(firstName) || !/^[A-Za-z\s]+$/.test(lastName)) {
            return new Response(
                JSON.stringify({ error: 'Names should only contain letters' }),
                { status: 400, headers }
            );
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return new Response(
                JSON.stringify({ error: 'Please enter a valid email address' }),
                { status: 400, headers }
            );
        }

        // Validate mobile number (10 digits)
        if (!/^\d{10}$/.test(mobile)) {
            return new Response(
                JSON.stringify({ error: 'Please enter a valid 10-digit mobile number' }),
                { status: 400, headers }
            );
        }

        // Insert into database with comprehensive user tracking
        const result = await sql`
            INSERT INTO contacts (
                salutation, first_name, last_name, email, mobile, company, message,
                ip_address, user_agent, browser, operating_system, device_type,
                screen_resolution, language, timezone, referrer
            )
            VALUES (
                ${salutation || null},
                ${firstName.trim()},
                ${lastName.trim()},
                ${email.trim()},
                ${mobile.trim()},
                ${company?.trim() || null},
                ${message.trim()},
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
