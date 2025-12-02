# Railway Setup – Individual Gemini Keys

Railway's env editor sometimes strips commas, so the backend supports dedicated `GEMINI_API_KEY_n` variables. Use this playbook when the comma-separated approach misbehaves.

## Steps

1. Open the [Railway Dashboard](https://railway.app) → select the backend service (e.g., **PSG1**).
2. `Variables` tab → remove the legacy `GEMINI_API_KEY` entry if it contains comma-separated values that Railway reformats.
3. Add numbered variables:

| Variable | Value Example |
|----------|---------------|
| `GEMINI_API_KEY_1` | `AIza...AAA` |
| `GEMINI_API_KEY_2` | `AIza...BBB` |
| `GEMINI_API_KEY_3` | `AIza...CCC` |
| `GEMINI_API_KEY_4` | `AIza...DDD` |
| `GEMINI_API_KEY_5` | `AIza...EEE` |
| `GEMINI_API_KEY_6` | `AIza...FFF` |

> Use your actual keys in place of the placeholders and keep each value on its own line entry.

4. Railway redeploys automatically; check logs for:
   ```
   🔧 GeminiClient constructor called
      Individual keys (GEMINI_API_KEY_1, _2, ...): 6
      Comma-separated keys (GEMINI_API_KEY): 0
      Total unique keys: 6
   ✅ Initialized GeminiClient with 6 API key(s)
   ```

## How the Backend Resolves Keys
1. Reads numbered variables (`GEMINI_API_KEY_1` … `_20`).
2. Falls back to `GEMINI_API_KEY` if numbered entries are absent.
3. Deduplicates keys and builds the rotation pool.

## Local Development
- Keep using comma-separated values in `backend/.env`:
  ```env
  GEMINI_API_KEY=AIza...AAA,AIza...BBB,AIza...CCC
  ```
- The resolver merges both sources and removes duplicates automatically.

## Validation
- Hit `/api/health` and `/api/test-keys` (if enabled) to confirm key counts and validity.
- Expect at least one key to succeed; errors in logs will flag any invalid or rate-limited key.

## Checklist
- [ ] Remove stale `GEMINI_API_KEY`
- [ ] Add `GEMINI_API_KEY_1..n`
- [ ] Push latest code (Gemini client changes)
- [ ] Wait for Railway redeploy
- [ ] Confirm logs show total unique key count
- [ ] Run smoke tests from the frontend
