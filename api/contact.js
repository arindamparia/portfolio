import { sql } from '../src/config/database.js';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { salutation, firstName, lastName, email, mobile, company, message } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !mobile || !message) {
            return res.status(400).json({
                error: 'First name, last name, email, mobile, and message are required'
            });
        }

        // Insert into database
        const result = await sql`
            INSERT INTO contacts (salutation, first_name, last_name, email, mobile, company, message)
            VALUES (
                ${salutation || null},
                ${firstName.trim()},
                ${lastName.trim()},
                ${email.trim()},
                ${mobile.trim()},
                ${company?.trim() || null},
                ${message.trim()}
            )
            RETURNING id, salutation, first_name, last_name, email, mobile, company, created_at
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
}
