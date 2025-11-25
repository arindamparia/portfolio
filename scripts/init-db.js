import 'dotenv/config';
import { sql } from '../src/config/database.js';

async function initDatabase() {
    try {
        console.log('Creating contacts table...');

        // Create contacts table with all form fields + comprehensive user tracking
        await sql`
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                salutation VARCHAR(10),
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                mobile VARCHAR(20) NOT NULL,
                company VARCHAR(255),
                message TEXT NOT NULL,
                ip_address VARCHAR(45),
                user_agent TEXT,
                browser VARCHAR(100),
                operating_system VARCHAR(100),
                device_type VARCHAR(50),
                screen_resolution VARCHAR(20),
                language VARCHAR(10),
                timezone VARCHAR(50),
                referrer TEXT,
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
