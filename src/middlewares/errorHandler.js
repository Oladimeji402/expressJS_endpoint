export default function errorHandler(err, req, res, next) {
  // Log details server-side (replace with a structured logger in production)
  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    path: req.path,
    body: req.body && Object.keys(req.body).length ? "[REDACTED]" : undefined,
    // Do NOT log sensitive fields like passwords, tokens, OTPs
  });

  // If headers already sent, delegate to default handler
  if (res.headersSent) return next(err);

  // Handle validation errors from express-validator
  const status = err.status || 500;

  // Provide a generic message to the client
  const safeMessage = status >= 500 ? "Server error" : err.message || "Error";

  res.status(status).json({ error: safeMessage });
}
