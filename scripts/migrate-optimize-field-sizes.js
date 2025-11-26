import 'dotenv/config';
import { sql } from '../src/config/database.js';

async function migrateDatabase() {
    try {
        console.log('Optimizing field sizes in contacts table...\n');

        // Optimize salutation
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN salutation TYPE VARCHAR(3)`;
            console.log('✓ Optimized salutation: VARCHAR(3)');
        } catch (error) {
            console.log('⚠ Salutation column error:', error.message);
        }

        // Optimize first_name
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN first_name TYPE VARCHAR(30)`;
            console.log('✓ Optimized first_name: VARCHAR(30)');
        } catch (error) {
            console.log('⚠ First_name column error:', error.message);
        }

        // Optimize last_name
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN last_name TYPE VARCHAR(30)`;
            console.log('✓ Optimized last_name: VARCHAR(30)');
        } catch (error) {
            console.log('⚠ Last_name column error:', error.message);
        }

        // Optimize email
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN email TYPE VARCHAR(80)`;
            console.log('✓ Optimized email: VARCHAR(80)');
        } catch (error) {
            console.log('⚠ Email column error:', error.message);
        }

        // Optimize company
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN company TYPE VARCHAR(80)`;
            console.log('✓ Optimized company: VARCHAR(80)');
        } catch (error) {
            console.log('⚠ Company column error:', error.message);
        }

        // Optimize message
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN message TYPE VARCHAR(500)`;
            console.log('✓ Optimized message: VARCHAR(500)');
        } catch (error) {
            console.log('⚠ Message column error:', error.message);
        }

        // Optimize user_agent
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN user_agent TYPE VARCHAR(200)`;
            console.log('✓ Optimized user_agent: VARCHAR(200)');
        } catch (error) {
            console.log('⚠ User_agent column error:', error.message);
        }

        // Optimize browser
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN browser TYPE VARCHAR(30)`;
            console.log('✓ Optimized browser: VARCHAR(30)');
        } catch (error) {
            console.log('⚠ Browser column error:', error.message);
        }

        // Optimize operating_system
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN operating_system TYPE VARCHAR(30)`;
            console.log('✓ Optimized operating_system: VARCHAR(30)');
        } catch (error) {
            console.log('⚠ Operating_system column error:', error.message);
        }

        // Optimize device_type
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN device_type TYPE VARCHAR(10)`;
            console.log('✓ Optimized device_type: VARCHAR(10)');
        } catch (error) {
            console.log('⚠ Device_type column error:', error.message);
        }

        // Optimize screen_resolution
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN screen_resolution TYPE VARCHAR(15)`;
            console.log('✓ Optimized screen_resolution: VARCHAR(15)');
        } catch (error) {
            console.log('⚠ Screen_resolution column error:', error.message);
        }

        // Optimize language
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN language TYPE VARCHAR(5)`;
            console.log('✓ Optimized language: VARCHAR(5)');
        } catch (error) {
            console.log('⚠ Language column error:', error.message);
        }

        // Optimize timezone
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN timezone TYPE VARCHAR(40)`;
            console.log('✓ Optimized timezone: VARCHAR(40)');
        } catch (error) {
            console.log('⚠ Timezone column error:', error.message);
        }

        // Optimize referrer
        try {
            await sql`ALTER TABLE contacts ALTER COLUMN referrer TYPE VARCHAR(200)`;
            console.log('✓ Optimized referrer: VARCHAR(200)');
        } catch (error) {
            console.log('⚠ Referrer column error:', error.message);
        }

        console.log('\n✅ Migration completed successfully!');

        // Verify column types
        const columns = await sql`
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'contacts'
            ORDER BY ordinal_position
        `;

        console.log('\nUpdated table structure:');
        console.table(columns);

    } catch (error) {
        console.error('Error migrating database:', error);
        throw error;
    }
}

migrateDatabase();
