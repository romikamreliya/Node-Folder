class Constants {
  // ─── Pagination ────────────────────────────────────
  static defaultPageLimit = 10;
  static maxPageLimit = 1000;

  // ─── Order By Options ──────────────────────────────
  static orderByOptions = {
    asc: "ASC",
    desc: "DESC",
  }

  // ─── Language ──────────────────────────────────────
  static defaultLanguage = "en";

  // ─── User Types ────────────────────────────────────
  static userType = {
    admin: "Admin",
    user: "User",
    publisher: "Publisher",
  };

  // ─── Status Codes ──────────────────────────────────
  static statusCode = {
    success: 200,
    error: 500,
  };

  // ─── Token Types ───────────────────────────────────
  static tokenType = {
    api: "api",
    web: "web",
  };

  // ─── Token / Crypto ────────────────────────────────
  static token = {
    jwtExpire: "15m",
    jwtAlgorithm: "HS256",
    refreshBytes: 64,
    refreshExpireMs: 7 * 24 * 60 * 60 * 1000,   // 7 days
    aesExpireMs: 24 * 60 * 60 * 1000,            // 24 hours
    aesAlgorithm: "aes-256-gcm",
    aesIvBytes: 12,
    aesTagBytes: 16,
    aesSaltBytes: 16,
    pbkdf2Iterations: 100000,
    pbkdf2KeyLength: 32,
    pbkdf2Digest: "sha256",
    fallbackSecretBytes: 32,
  };

  // ─── Password Hashing ─────────────────────────────
  static password = {
    saltBytes: 16,
    keyLength: 64,
  };

  // ─── Rate Limiting ────────────────────────────────
  static rateLimit = {
    // Global (IP-based, unauthenticated)
    windowMs: 1 * 60 * 1000,       // 1 minute
    maxRequests: 60,

    // Per-user (authenticated, keyed by user ID)
    userWindowMs: 1 * 60 * 1000,   // 1 minute
    userMaxRequests: 120,

    // Endpoint-specific presets
    auth: {
      windowMs: 15 * 60 * 1000,    // 15 minutes
      maxRequests: 10,              // 10 attempts per 15 min
    },

    // Paths to skip entirely
    skipPaths: ["/health", "/favicon.ico"],
  };

  // ─── HTTP / CORS / Helmet ─────────────────────────
  static http = {
    bodyLimitJson: "10mb",
    bodyLimitUrlEncoded: "10mb",
    hstsMaxAge: 31536000,          // 1 year in seconds
    corsMaxAge: 86400,             // 24 hours in seconds
    corsOptionsStatus: 200,
  };

  // ─── Logging ──────────────────────────────────────
  static logging = {
    maxFileSize: 5 * 1024 * 1024,  // 5 MB
    maxFiles: 5,
  };

  // ─── Cron Jobs ────────────────────────────────────
  static cron = {
    defaultTimezone: "Asia/Kolkata",
    scheduleOffsetMs: 5000,         // 5 seconds
  };

  // ─── Memory Monitoring ────────────────────────────
  static memory = {
    defaultIntervalMs: 10000,       // 10 seconds
  };

  // ─── Socket.IO ────────────────────────────────────
  static socket = {
    maxHttpBufferSize: 1e6,         // 1 MB (default is 1e6, explicit for visibility)
  };
}

module.exports = Constants;
