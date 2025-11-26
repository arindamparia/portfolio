# CORS Security Configuration

## Understanding CORS in This Application

### Production Environment (Netlify)

**Your site makes SAME-ORIGIN requests:**
- Frontend: `https://your-site.netlify.app`
- API Call: `https://your-site.netlify.app/api/contact`
- Result: **CORS does not apply** - the browser allows this automatically

**CORS only applies to CROSS-ORIGIN requests:**
- Different Domain: `https://other-site.com` → `https://your-site.netlify.app/api/contact`
- Result: **CORS applies** - origin must be in ALLOWED_ORIGINS

### Why Your Form Works Even With Wrong ALLOWED_ORIGINS

If you set `ALLOWED_ORIGINS` to incorrect values in Netlify (e.g., `https://wrong-domain.com`), your form **still works** because:

1. Your frontend and API are on the same domain (same-origin)
2. The browser doesn't enforce CORS for same-origin requests
3. CORS is only checked when a different domain tries to call your API

### When CORS Is Actually Enforced

CORS will reject requests when:

```
✅ Allowed: https://your-site.netlify.app → https://your-site.netlify.app/api/contact
   (Same origin - CORS not checked)

❌ Blocked: https://malicious-site.com → https://your-site.netlify.app/api/contact
   (Cross-origin - CORS checked, origin not in ALLOWED_ORIGINS)

✅ Allowed: https://partner-site.com → https://your-site.netlify.app/api/contact
   (Cross-origin - CORS checked, origin in ALLOWED_ORIGINS)
```

## Current CORS Security Implementation

### Netlify Function (`netlify/functions/contact.js`)

**Security Rules:**
1. ✅ **No origin header** → Allow (same-origin request or tools like Postman)
2. ❌ **Origin header exists + ALLOWED_ORIGINS empty** → **REJECT** (security: prevent misconfiguration)
3. ✅ **Origin in ALLOWED_ORIGINS** → Allow
4. ❌ **Origin not in ALLOWED_ORIGINS** → **REJECT** (403 error)

### Express Server (`server.js`)

**Security Rules:**
1. ✅ **No origin header** → Allow (same-origin request)
2. ✅ **Origin in ALLOWED_ORIGINS** → Allow
3. ❌ **Origin not in ALLOWED_ORIGINS** → **REJECT**
4. 🛡️ **Default:** `http://localhost:5173,http://localhost:3000` (for development)

## Configuration

### Development (.env file)
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Production (Netlify Environment Variables)

**Option 1: No cross-origin API access (recommended)**
- Don't set `ALLOWED_ORIGINS` or leave it empty
- Your site will work perfectly (same-origin requests)
- Cross-origin API calls from other domains will be blocked

**Option 2: Allow specific domains**
```
ALLOWED_ORIGINS=https://partner-site.com,https://another-trusted-domain.com
```
Only set this if you want other websites to be able to call your API.

## Testing CORS

### Test 1: Same-Origin Request (Production)
```bash
# This will work because it's same-origin
curl https://your-site.netlify.app/api/contact \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test"}'
```

### Test 2: Cross-Origin Request (Should Be Blocked)
```javascript
// From browser console on https://google.com
fetch('https://your-site.netlify.app/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({name:'Test',email:'test@example.com',message:'Test'})
})
// Result: CORS error if google.com is not in ALLOWED_ORIGINS
```

### Test 3: No Origin Header (curl/Postman)
```bash
# This will work because there's no Origin header
curl https://your-site.netlify.app/api/contact \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test"}'
```

## Security Improvements Made

### Before (Insecure)
```javascript
// Allowed ALL origins if ALLOWED_ORIGINS was empty
const isAllowedOrigin = !origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin);
```

### After (Secure)
```javascript
// Explicitly reject cross-origin requests when ALLOWED_ORIGINS is misconfigured
if (!origin) {
    // Same-origin or no-origin (Postman) - Allow
    isAllowedOrigin = true;
} else if (allowedOrigins.length === 0) {
    // Cross-origin but ALLOWED_ORIGINS not set - REJECT for security
    isAllowedOrigin = false;
} else if (allowedOrigins.includes(origin)) {
    // Origin in allowed list - Allow
    isAllowedOrigin = true;
} else {
    // Origin not in allowed list - REJECT
    isAllowedOrigin = false;
}

// Explicitly reject with 403
if (origin && !isAllowedOrigin) {
    return new Response(
        JSON.stringify({ error: `Origin ${origin} not allowed by CORS policy` }),
        { status: 403, headers }
    );
}
```

## Recommendations

1. **For Production:** Don't set `ALLOWED_ORIGINS` in Netlify unless you need cross-origin access
2. **For Development:** Keep `ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000` in `.env`
3. **Security:** Never use wildcard `*` in production for sensitive APIs
4. **Testing:** Use browser DevTools Network tab to verify CORS headers
5. **Monitoring:** Check server logs for CORS rejection errors (403 status)

## References

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP: CORS Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html)
