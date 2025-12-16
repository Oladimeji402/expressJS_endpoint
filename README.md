# Auth API

A small Express API using Supabase for authentication. Supports both password-based and passwordless (email OTP) flows.

##  Features

- Signup with email/password and create a user profile in the `profiles` table.
- Verify email using OTP (one-time password) and receive access/refresh tokens.
- Request an OTP for passwordless login.
- Login using password or OTP.

##  Environment

The service expects the following environment variables to be set:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (used for inserting into `profiles`)

##  Routes

### POST /signup

- Body: `{ username, email, phone, password, confirmPassword }`
- Validation:
  - `username`: string, 3-30 chars
  - `email`: valid email
  - `phone`: digits/phone characters (7-20 chars)
  - `password`: min 8 chars, must include upper, lower and a number
  - `confirmPassword`: must match `password`
- Rate limiter: `authLimiter` (10 requests / 15 minutes)
- Response: `201` with message on success, or `400` with errors

### POST /verify-otp

- Body: `{ email, otp }`
- Validation: both fields required
- Rate limiter: `authLimiter` (10 requests / 15 minutes)
- Response: access and refresh tokens on success

### POST /login

- Body: `{ email, password?, otp? }` — provide either `password` or `otp`.
- Validation: `email` required; `password` and `otp` optional (but one is required by controller logic)
- Rate limiter: `authLimiter` (10 requests / 15 minutes)
- Response: tokens and user object on success

### POST /login/otp

- Body: `{ email }`
- Validation: `email` required
- Rate limiter: `otpLimiter` (5 requests / 15 minutes)
- Response: message indicating OTP was sent

## Implementation notes

- `signup` calls `supabase.auth.signUp` then inserts `{ id, username, phone }` into the `profiles` table using the service role client (`SUPABASE_SERVICE_ROLE_KEY`).
- OTP flows use Supabase's `signInWithOtp` and `verifyOtp` features.
- Password sign-in uses `signInWithPassword`.

##  Rate limits

- `authLimiter`: 10 requests per 15 minutes
- `otpLimiter`: 5 requests per 15 minutes

See `README-OTP.md` for a short OTP usage guide.
