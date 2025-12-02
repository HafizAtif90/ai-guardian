# Railway vs Local – Environment Parity Checklist

Local builds often work while Railway fails because of configuration drift. Use this checklist to align environments.

## Local Status (known good)
- 6 keys load successfully.
- Keys 1-4 show 429 quota errors (expected late in day) and are put on cooldown.
- Key 5 (and any additional keys) continue serving traffic.
- Rotation + retries behave as expected.

## Railway Failure Modes

### 1. Missing Environment Variable
- `GEMINI_API_KEY` or numbered vars are absent.
- Fix: Copy the **exact** `.env` value into Railway or add numbered entries.

### 2. Formatting Issues
- Keys split across multiple lines.
- Extra quotes, extra commas, or whitespace-only entries.
- Fix: ensure the value is a single comma-separated line or switch to numbered variables.

### 3. Stale Deployment
- Railway still runs an old commit.
- Fix: trigger redeploy (see runbooks) and confirm logs mention key rotation.

### 4. Divergent Keys
- Local `.env` updated but Railway keys not refreshed.
- Fix: paste the latest keys into Railway and redeploy.

### 5. Invalid Keys
- Keys revoked or disabled in Google AI Studio.
- Fix: regenerate keys, update Railway, and verify via `/api/test-keys`.

## Quick Fix Steps
1. Copy the comma-separated value from `backend/.env`.
2. Railway → Variables → update `GEMINI_API_KEY` or add numbered variables.
3. Save to trigger redeploy.
4. Watch logs for:
   ```
   🔍 Checking environment variables...
      GEMINI_API_KEY: Found (6 key(s))
   🔧 GeminiClient constructor called
   ✅ Initialized GeminiClient with 6 API key(s)
   ```
5. Curl `/api/test-keys` (if endpoint enabled) to validate each key.

## Validation Endpoints
- Health: `https://<railway-app>.up.railway.app/api/health`
- Optional diagnostics: `/api/test-keys` returns per-key status.

## Expected Result After Fix
- Startup logs show the same key count as local.
- Keys rotate exactly as they do locally (some may be on cooldown, at least one succeeds).
- Frontend requests succeed and CORS headers reflect the Vercel domain.
