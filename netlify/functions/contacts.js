import { neon } from '@neondatabase/serverless';

// Neon database connection
const sql = neon(process.env.DATABASE_URL);

export default async (req) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers }
        );
    }

    try {
        const contacts = await sql`
            SELECT id, salutation, first_name, last_name, email, mobile, company, message,
                   ip_address, user_agent, browser, operating_system, device_type,
                   screen_resolution, language, timezone, referrer, created_at
            FROM contacts
            ORDER BY created_at DESC
        `;

        return new Response(
            JSON.stringify({
                success: true,
                count: contacts.length,
                data: contacts
            }),
            { status: 200, headers }
        );

    } catch (error) {
        console.error('Error fetching contacts:', error);
        return new Response(
            JSON.stringify({
                error: 'Failed to fetch contacts',
                details: error.message
            }),
            { status: 500, headers }
        );
    }
};

export const config = {
    path: '/api/contacts'
};
