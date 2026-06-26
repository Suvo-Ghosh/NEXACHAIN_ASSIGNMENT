import rateLimit from 'express-rate-limit';

// Strict limiter for Auth routes (Login/Register)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { 
    success: false, 
    message: 'Too many authentication attempts from this IP, please try again after an hour' 
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
});

// General limiter for other API routes (Investments, Dashboard, etc.)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { 
    success: false, 
    message: 'Too many requests from this IP, please try again after 15 minutes' 
  },
});