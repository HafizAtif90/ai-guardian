# Troubleshooting: "API key not valid" Errors

## 1. Inspect Railway Variables
1. Railway dashboard → backend service → **Variables**.
2. Select `GEMINI_API_KEY` (or numbered entries) and confirm the format.
3. Value must be a single comma-separated line, for example:
   ```
   AIza...AAA,AIza...BBB,AIza...CCC,AIza...DDD
   ```
4. Avoid multi-line values, stray quotes, or trailing commas. Spaces are trimmed automatically but keeping them out reduces risk.

If the value is malformed:
- Delete the variable.
- Recreate it with the corrected value.
- Railway redeploys automatically.

## 2. Check Logs After Redeploy
Look for:
```
✅ Initialized GeminiClient with 6 API key(s)
   Key 1: AIza... (length: 39)
```
Missing keys mean the environment variable is still misconfigured.

## 3. Exercise the API
Trigger an analysis request from the frontend. Logs should show key rotation details:
```
🔑 Attempting with key 1/6: AIza...
❌ Key 1 failed: Status 400 - API key not valid
🚫 Key 1 marked INVALID
```
The system falls back to the next key automatically.

## 4. Validate Keys Against Google
Option A – CURL test:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=<KEY>" ^
  -H "Content-Type: application/json" ^
  -d '{"contents":[{"parts":[{"text":"ping"}]}]}'
```
Option B – Google AI Studio → API Keys → ensure keys are enabled and not revoked.

## 5. When All Keys Fail
- Keys may be invalidated or exceeded the quota.
- Generate fresh keys and update Railway.
- Keep documentation free of actual key values; reference them via password manager or secret store instead.

## Quick Checklist
- [ ] `GEMINI_API_KEY` value is one line, comma-separated
- [ ] Redeploy triggered after edits
- [ ] Logs show correct key count
- [ ] Frontend requests reach backend
- [ ] Keys validated against Google AI Studio
