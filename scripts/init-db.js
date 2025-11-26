import 'dotenv/config';
import { sql } from '../src/config/database.js';

async function initDatabase() {
    try {
        console.log('Creating contacts table...');

        // Create contacts table with all form fields + comprehensive user tracking
        await sql`
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                salutation VARCHAR(3),
                first_name VARCHAR(30) NOT NULL,
                last_name VARCHAR(30) NOT NULL,
                email VARCHAR(80) NOT NULL,
                mobile VARCHAR(20) NOT NULL,
                company VARCHAR(80),
                message VARCHAR(100) NOT NULL,
                ip_address VARCHAR(45),
                user_agent VARCHAR(200),
                browser VARCHAR(30),
                operating_system VARCHAR(30),
                device_type VARCHAR(10),
                screen_resolution VARCHAR(15),
                language VARCHAR(5),
                timezone VARCHAR(40),
                referrer VARCHAR(200),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log('Contacts table created successfully!');

        // Verify table creation
        const tables = await sql`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = 'contacts'
        `;

        console.log('Verification:', tables);

    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

initDatabase();
