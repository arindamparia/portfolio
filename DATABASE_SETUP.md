# Database Setup Guide

This guide explains how to set up and use the Neon PostgreSQL database for the contact form.

## Prerequisites

- Node.js installed
- Neon database account with connection string

## Database Configuration

The database connection is configured using environment variables for security. The connection string is stored in the `.env` file.

## Setup Steps

### 1. Create Environment File

Copy the example environment file and add your Neon database connection string:

```bash
cp .env.example .env
```

Then edit `.env` and replace with your actual Neon connection string:


**Important:** Never commit the `.env` file to version control. It's already added to `.gitignore`.

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `@neondatabase/serverless` - Neon database client
- `express` - Backend server
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `ua-parser-js` - User agent parser for device detection

### 3. Initialize Database

Run the database initialization script to create the contacts table:

```bash
npm run init-db
```

This will create a `contacts` table with the following structure:

```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    salutation VARCHAR(3),
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(80) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    company VARCHAR(80),
    message VARCHAR(500) NOT NULL,
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
```

**Note:** The table includes the first 3 fields (salutation, first_name, last_name) plus comprehensive user tracking for security, analytics, and insights.

### 4. Start the Backend Server

In one terminal, start the Express server:

```bash
npm run server
```

The server will run on `http://localhost:3001` with the following endpoints:
- `POST /api/contact` - Submit contact form data
- `GET /api/contacts` - Retrieve all contacts (for testing)
- `GET /api/health` - Health check endpoint

### 5. Start the Frontend Development Server

In another terminal, start the Vite development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy).

## Form Fields

The contact form submits the following fields to the database:

### User-Provided Fields:
1. **Salutation** (optional) - Mr, Ms, Mrs, or None
2. **First Name** (required) - Minimum 3 characters, letters only
3. **Last Name** (required) - Minimum 3 characters, letters only

### Automatically Collected Metadata:
4. **IP Address** - Client's IP address (supports proxy detection)
5. **User Agent** - Complete browser user agent string
6. **Browser** - Parsed browser name and version (e.g., "Chrome 120.0")
7. **Operating System** - OS name and version (e.g., "Windows 10")
8. **Device Type** - desktop, mobile, tablet, or other
9. **Screen Resolution** - Display resolution (e.g., "1920x1080")
10. **Language** - User's browser language preference
11. **Timezone** - User's timezone (e.g., "America/New_York")
12. **Referrer** - Source URL or "direct" if no referrer

Additional form fields (email, mobile, company, message) are validated on the frontend but not yet saved to the database.

## API Endpoints

### POST /api/contact

Submit contact information:

```javascript
fetch('http://localhost:3001/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    salutation: 'Mr',
    firstName: 'John',
    lastName: 'Doe',
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenResolution: '1920x1080',
    timezone: 'America/New_York',
    referrer: document.referrer || 'direct'
  })
})
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Contact information saved successfully",
  "data": {
    "id": 1,
    "salutation": "Mr",
    "first_name": "John",
    "last_name": "Doe",
    "ip_address": "192.168.1.1",
    "browser": "Chrome 120.0",
    "operating_system": "Windows 10",
    "device_type": "desktop",
    "created_at": "2025-11-25T10:30:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "error": "First name and last name are required"
}
```

### GET /api/contacts

Retrieve all contacts:

```javascript
fetch('http://localhost:3001/api/contacts')
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "salutation": "Mr",
      "first_name": "John",
      "last_name": "Doe",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "browser": "Chrome 120.0",
      "operating_system": "Windows 10",
      "device_type": "desktop",
      "screen_resolution": "1920x1080",
      "language": "en-US",
      "timezone": "America/New_York",
      "referrer": "https://google.com",
      "created_at": "2025-11-25T10:30:00.000Z"
    },
    // ... more contacts
  ]
}
```

## Validation Rules

### First Name & Last Name
- Required fields
- Minimum 3 characters
- Only letters and spaces allowed
- Trimmed before saving

### Salutation
- Optional field
- Must be one of: Mr, Ms, Mrs, or empty

### Automatically Collected Metadata

#### IP Address
- Automatically captured from request headers
- Handles proxy scenarios (x-forwarded-for, x-real-ip)
- Stored for security and analytics purposes

#### User Agent & Device Information
- **User Agent**: Complete browser user agent string
- **Browser**: Automatically parsed from user agent (name + version)
- **Operating System**: Automatically parsed from user agent (name + version)
- **Device Type**: Detected as desktop, mobile, tablet, or other
- All parsing done server-side using ua-parser-js

#### Client Environment
- **Screen Resolution**: Captured from browser window object
- **Language**: Browser's preferred language setting
- **Timezone**: User's system timezone
- **Referrer**: Source URL that directed the user to your site

All metadata is collected automatically on form submission and requires no user input.

## Troubleshooting

### Database Connection Issues

If you see `Error connecting to database`, check:
1. Your internet connection
2. The Neon connection string is correct
3. The Neon database is active and not suspended

### CORS Issues

If the frontend can't connect to the backend:
1. Make sure both servers are running
2. Check that the backend is on port 3001
3. Verify the fetch URL in Contact.jsx matches your backend URL

### Port Already in Use

If port 3001 is already in use, you can change it in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Change 3001 to another port
```

Also update the fetch URL in `src/components/Modern/Contact.jsx`.

## Security Best Practices

1. **Environment Variables**: Database credentials are stored in `.env` file which is excluded from version control
2. **Never Commit Secrets**: The `.env` file is in `.gitignore` to prevent accidental commits
3. **Use `.env.example`**: Share the `.env.example` file (without real credentials) with your team
4. **Rotate Credentials**: Regularly update database passwords and connection strings
5. **HTTPS in Production**: Always use HTTPS in production environments

## Next Steps

To add more fields to the database:
1. Update the table schema in `scripts/init-db.js`
2. Add columns using ALTER TABLE or recreate the table
3. Update the API endpoint in `server.js` to accept new fields
4. Update the Contact component to send new fields

## Files Structure

```
portfolio/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   └── components/
│       └── Modern/
│           └── Contact.jsx      # Contact form component
├── scripts/
│   └── init-db.js              # Database initialization script
├── server.js                    # Express backend server
└── DATABASE_SETUP.md           # This file
```
