# Runbook: Force Railway to Use Latest Code

Railway occasionally sticks to an older image. Use any of the methods below to redeploy the current `main` branch.

## Symptoms
- Logs show legacy error messages such as `GEMINI_API_KEY is not set in environment variables`.
- Latest code should emit `No API keys found. Set GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.`

## Method 1 – Trigger via Git (Recommended)
```bash
# Make a harmless change
echo "# Railway redeploy trigger" >> backend/README.md
git add backend/README.md
git commit -m "Trigger Railway redeploy"
git push origin main
```
Railway redeploys after the push.

## Method 2 – Manual Redeploy
1. Railway dashboard → service → **Deployments**.
2. Locate the latest deployment.
3. Click `⋯` → **Redeploy**.

## Method 3 – Verify Source Linkage
1. Railway → service → **Settings**.
2. Under **Source**, confirm repository, branch (`main`), and auto-deploy are correct.

## Method 4 – Clear Build Cache
1. Railway → service → **Settings**.
2. Use **Clear Build Cache** (if available) and trigger redeploy.

## Verification
After redeploy, logs should show:
```
🔧 GeminiClient constructor called
   Individual keys (GEMINI_API_KEY_1, _2, etc.): 6
   Total unique keys: 6
✅ Initialized GeminiClient with 6 API key(s)
```

If the old error persists, double-check environment variables and rerun this playbook.
