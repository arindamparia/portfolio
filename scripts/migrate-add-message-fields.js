import 'dotenv/config';
import { sql } from '../src/config/database.js';

async function migrateDatabase() {
    try {
        console.log('Adding missing columns to contacts table...');

        // Add email column
        try {
            await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL DEFAULT ''`;
            console.log('✓ Added email column');
        } catch (error) {
            console.log('Email column might already exist:', error.message);
        }

        // Add mobile column
        try {
            await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS mobile VARCHAR(20) NOT NULL DEFAULT ''`;
            console.log('✓ Added mobile column');
        } catch (error) {
            console.log('Mobile column might already exist:', error.message);
        }

        // Add company column
        try {
            await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company VARCHAR(255)`;
            console.log('✓ Added company column');
        } catch (error) {
            console.log('Company column might already exist:', error.message);
        }

        // Add message column
        try {
            await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS message TEXT NOT NULL DEFAULT ''`;
            console.log('✓ Added message column');
        } catch (error) {
            console.log('Message column might already exist:', error.message);
        }

        console.log('\nMigration completed successfully!');

        // Verify columns
        const columns = await sql`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'contacts'
            ORDER BY ordinal_position
        `;

        console.log('\nCurrent table structure:');
        console.table(columns);

    } catch (error) {
        console.error('Error migrating database:', error);
        throw error;
    }
}

migrateDatabase();
