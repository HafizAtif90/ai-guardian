# Deployment Guide – Multi-Key Gemini Setup

This guide covers the multi-key Gemini client, Railway backend deployment, and Vercel frontend rollout.

## Backend Updates Recap
- `backend/utils/geminiClient.js` supports comma-separated keys and `GEMINI_API_KEY_#` variables.
- Automatic key rotation handles 429 quota and 503 overload responses.
- Retry logic uses exponential backoff and tracks key health per failure type.
- All analysis controllers use the shared Gemini client.

---

## Railway Backend Deployment

### 1. Push Latest Code
```bash
git add .
git commit -m "Add multi-key Gemini deployment support"
git push origin main
```
Railway auto-builds when the repo is connected.

### 2. Configure Environment Variables
1. Open the Railway dashboard, choose the backend service.
2. `Variables` tab → update the Gemini key entry.
3. Paste comma-separated keys (no line breaks, optional spaces after commas) such as:
   ```
   GEMINI_API_KEY=AIza...AAA,AIza...BBB,AIza...CCC
   ```
   or add numbered keys:
   ```
   GEMINI_API_KEY_1=AIza...AAA
   GEMINI_API_KEY_2=AIza...BBB
   ```
4. Ensure `PORT`, `NODE_ENV=production`, and `FRONTEND_URL=https://your-frontend.vercel.app` exist.

### 3. Redeploy & Verify
- Railway redeploys automatically when env vars change; manually hit **Redeploy** if needed.
- Logs should include:
  ```
  ✅ Initialized GeminiClient with 6 API key(s)
  🚫 Key 1 marked as QUOTA EXCEEDED (429)
  ⏸️ Key 5 marked as rate-limited (503)
  ```

---

## Vercel Frontend Deployment

### 1. Push Frontend Changes
```bash
cd Frontend
git add .
git commit -m "Wire up new backend behaviour"
git push origin main
```
Vercel auto-deploys after the push.

### 2. Environment Variables
- Only `NEXT_PUBLIC_API_BASE_URL` is required.
- Set it to the Railway backend URL, e.g. `https://psg1-production.up.railway.app`.
- Remove any stray `GEMINI_API_KEY` variables from Vercel (frontend never needs secrets).

### 3. Redeploy if Needed
- Vercel redeploys automatically after repo updates or env changes; fallback to the **Redeploy** button.

---

## Post-Deployment Validation

### Backend
- Curl the health endpoint:
  ```bash
  curl https://<railway-app>.up.railway.app/api/health
  ```
- Exercise the text analysis endpoint and watch for key rotation log entries.

### Frontend
- Visit the Vercel URL, run through text/image/audio/video analysis flows.
- Confirm graceful messaging when throttled.

---

## Monitoring

### Expected Log Lines
- Startup: `✅ Initialized GeminiClient with N API key(s)`
- Quota skip: `🚫 Key X marked as QUOTA EXCEEDED (429)`
- Overload retry: `⏸️ Key Y marked as rate-limited (503)`
- Recovery: `✅ Key Y is working again`

### Alerts
- `All API keys have exceeded their quota` → add more keys or wait for reset.
- `Non-rate-limit error on key X` → check credential validity.

---

## Security Notes
- Never commit API keys; store them only as secrets.
- Keep the root `.env` out of version control by relying on `.env.example` for structure.
- Consider rotating keys regularly and pruning any docs that reference real secrets.

---

## Quick Reference
- Railway dashboard: https://railway.app
- Vercel dashboard: https://vercel.com
- Gemini usage dashboards: https://ai.google.dev/ and https://ai.google.dev/usage

Use the runbooks under `docs/runbooks/` if a redeploy stalls or Railway lags behind Git.
