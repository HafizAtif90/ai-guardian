# Troubleshooting: Frontend Cannot Reach Backend

## 1. Verify Vercel Environment Variable
- Vercel dashboard → project → **Settings → Environment Variables**.
- Ensure `NEXT_PUBLIC_API_BASE_URL` exists for all environments and points to the Railway domain, e.g. `https://psg1-production.up.railway.app`.
- Redeploy after changes.

## 2. Confirm Railway URL
- Railway dashboard → backend service.
- Copy the `https://<service>.up.railway.app` URL from the info panel.

## 3. Test the Backend Directly
```bash
curl https://<railway-app>.up.railway.app/api/health
```
Expected response:
```json
{"status":"ok","message":"AI Personal Safety Guardian API is running"}
```

## 4. Enable and Inspect Logging
- Push the latest backend logging improvements:
  ```bash
  git add backend/server.js
  git commit -m "Add request logging and improved CORS handling"
  git push origin main
  ```
- Railway logs should display entries such as:
  ```
  📥 POST /api/text-analysis
     Origin: https://your-app.vercel.app
  ```

## 5. Common Browser Errors
- `Failed to fetch` or `CORS error` → incorrect `NEXT_PUBLIC_API_BASE_URL` or CORS whitelist missing your domain.
- Use DevTools → Network tab to inspect failed requests and confirm the request URL.

## 6. Checklist
- [ ] Backend health endpoint reachable.
- [ ] Vercel env variable set + redeployed.
- [ ] Browser console shows requests targeting the Railway domain.
- [ ] Railway logs receive traffic when the frontend makes a request.
- [ ] CORS config in `backend/server.js` includes the Vercel domain or wildcard for testing.

## 7. Additional Diagnostics
- Check Vercel function logs for `/app/api/*` route errors.
- Confirm the value of `NEXT_PUBLIC_API_BASE_URL` via `console.log(process.env.NEXT_PUBLIC_API_BASE_URL)` in a temporary component (remove after verifying).
- Use `curl` or Postman from a remote environment to confirm the backend is publicly accessible.
