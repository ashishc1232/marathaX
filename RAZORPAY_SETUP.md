# MARATHA X — Razorpay + Unique QR setup

## 1. Secrets to add (Settings → Secrets)
| Name | What |
|---|---|
| RAZORPAY_KEY_ID | Razorpay Dashboard → Settings → API Keys (use `rzp_test_...` first) |
| RAZORPAY_KEY_SECRET | same page (never put in frontend code) |
| RAZORPAY_WEBHOOK_SECRET | a random string you choose; use the same in the webhook (step 2) |
| ADMIN_TOKEN | your admin password for /marathax/admin and QR staff view (replaces the old `_PLACEHOLDER`) |
| QR_SIGNING_SECRET | long random string; signs QR links so they can't be forged |
| PUBLIC_SITE_URL | e.g. `https://marathax.com` (no trailing slash) |

## 2. Razorpay webhook
Dashboard → Settings → Webhooks → Add:
- URL: `https://YOUR-DOMAIN/api/marathax/webhook`
- Secret: same as RAZORPAY_WEBHOOK_SECRET
- Events: `payment.captured`, `payment.failed`

## 3. Flow now
1. Athlete fills form → "Pay ₹X & Register".
2. Server creates a Razorpay Order; amount comes from the category on the SERVER.
3. Razorpay Checkout opens locked to that order (no way to pay ₹0/₹1/other).
4. Browser calls `/api/marathax/verify-payment` → server checks signature AND asks Razorpay for the real paid amount; must equal fee exactly.
5. Registration → `confirmed`, unique code + unique QR issued, emailed (QR attached) and shown on screen.
6. Webhook does the same if the athlete closes the tab after paying (idempotent).

## 4. QR
QR = signed link `https://DOMAIN/marathax/checkin?code=MX-2027-XXXXX&s=<signature>`.
- Anyone scanning: "Valid pass" + name + category only.
- Staff (enters ADMIN_TOKEN once on their phone): full registration details.

## 5. Test before going live
Use Razorpay TEST keys + test UPI/card. Confirm: pass email arrives, QR opens check-in page, admin dashboard shows "Confirmed".
Then swap to live keys.

## Database
No schema change needed. New online registrations use status `pending` → `confirmed`.
