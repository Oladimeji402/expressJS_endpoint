## OTP (Passwordless Email) Login

This project already uses Supabase for auth. I added endpoints to support passwordless login via email OTP.

Endpoints

- POST /login/otp — Request an OTP to be sent to the email. Body: { "email": "user@example.com" }
- POST /verify-otp — Verify an OTP and obtain session tokens. Body: { "email": "user@example.com", "otp": "123456" }
- POST /login — Supports both password login and OTP login. Body examples:
  - Password login: { "email": "user@example.com", "password": "secret" }
  - OTP login: { "email": "user@example.com", "otp": "123456" }

Quick manual test (curl)

1. Request OTP

curl -X POST http://localhost:8000/api/auth/login/otp -H "Content-Type: application/json" -d '{"email":"you@example.com"}'

2. After you receive OTP in your email, verify it and get tokens:

curl -X POST http://localhost:8000/api/auth/verify-otp -H "Content-Type: application/json" -d '{"email":"you@example.com","otp":"<CODE>"}'

or directly sign in with OTP via /login:

curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d '{"email":"you@example.com","otp":"<CODE>"}'

Notes

- Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in environment variables.
- Supabase will send the OTP email; configure your Supabase project's SMTP settings if needed.
- The existing signup flow already triggers verification for email when signing up.
