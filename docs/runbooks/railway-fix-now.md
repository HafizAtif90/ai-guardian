# Runbook: Railway Still Running Old Code

Use this when Railway continues to show the legacy `GEMINI_API_KEY is not set` error.

## Step 1 – Verify Git Connection
- Railway dashboard → service → **Settings → Source**.
- Confirm repository, branch (`main`), and auto-deploy toggle.

## Step 2 – Inspect Latest Deployment
- Open **Deployments**.
- Check commit hash matches the fix (e.g., `0cf5cdb` or newer).
- Ensure status is `Active`.

## Step 3 – Force Deployment
- **Option A:** `Deployments` → `⋯` → **Redeploy**.
- **Option B:** Clear build cache under **Settings**.
- **Option C:** Disconnect/reconnect the Git source to pull a fresh copy.

## Step 4 – Validate Logs
Look for these lines after redeploy:
```
🔧 GeminiClient constructor called
   Individual keys (GEMINI_API_KEY_1, _2, etc.): 6
   Total unique keys: 6
✅ Initialized GeminiClient with 6 API key(s)
```
If you still see `GEMINI_API_KEY is not set` the new build did not deploy.

## Troubleshooting
1. Ensure the branch is correct (`main`).
2. Check build logs for `git clone` and commit hash.
3. Confirm auto-deploy is enabled.

## Quick Actions
```bash
# Force redeploy with a no-op commit
echo "" >> backend/server.js
git add backend/server.js
git commit -m "Trigger Railway redeploy - force update"
git push origin main
```

## Post-Deploy
- Logs should contain new structured output.
- Test via frontend; rotation logs should appear.
- If issues persist, consider recreating the Railway service and re-adding environment variables.
