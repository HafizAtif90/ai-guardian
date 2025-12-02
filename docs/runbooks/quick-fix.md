# Runbook: Quick Fix for "API Key Invalid"

## 1. Ensure Code Is Up to Date
```bash
cd <repo>
git status
```
Commit pending Gemini client changes:
```bash
git add backend/utils/geminiClient.js
git commit -m "Add API key validation and debugging"
git push origin main
```

## 2. Validate Railway Environment Variable
1. Railway → backend service → **Variables**.
2. Inspect `GEMINI_API_KEY` (or numbered variables) and ensure one-line comma-separated entries, for example:
   ```
   AIza...AAA,AIza...BBB,AIza...CCC
   ```
3. If the formatting is wrong, delete and recreate the variable, then save to trigger redeploy.

## 3. Confirm Logs After Deployment
Expect:
```
✅ Initialized GeminiClient with 6 API key(s)
   Key 1: AIzaSy... (length: 39)
```
Absence of that message indicates environment variables are still misconfigured.

## 4. Generate a Request and Watch Logs
- Initiate text/image/audio/video analysis from the frontend.
- Logs should show rotation messages:
  ```
  🔑 Attempting with key 1/6: AIza...
  🚫 Key 1 is INVALID (400 Bad Request)
  🔑 Attempting with key 2/6: AIza...
  ```

## 5. If Every Key Fails
- Verify keys inside [Google AI Studio](https://makersuite.google.com/app/apikey).
- Regenerate keys if revoked and update Railway.

## Checklist
- [ ] Code pushed
- [ ] Railway variable updated (one line or numbered)
- [ ] Redeploy triggered
- [ ] Logs show `Initialized GeminiClient with N API key(s)`
- [ ] Request logs show rotation attempts
