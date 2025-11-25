import { neon } from '@neondatabase/serverless';

// Neon database connection string from environment variable
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Create SQL client
export const sql = neon(DATABASE_URL);

// Test connection
export async function testConnection() {
    try {
        const result = await sql`SELECT NOW()`;
        console.log('Database connected successfully:', result);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}
