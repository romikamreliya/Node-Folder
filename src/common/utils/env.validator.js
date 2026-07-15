/**
 * Environment variable validator.
 * Validates required env vars are present at startup to fail fast
 * with a clear error message instead of cryptic runtime crashes.
 * 
 * Import this AFTER dotenv.config() in server.js
 */
class EnvValidator {
  static requiredVars = [
    "NAME",
    "PORT",
    "ENV",
    "DATABASE_URL",
    "algorithm",
    "accessTokenKey",
    "refreshTokenKey"
  ];

  static optionalVars = [
    "HTTPS_ENABLED",
    "SWAGGER_ENABLED",
    "REQUEST_LOGGER_ENABLED",
    "ALLOWED_ORIGINS",
    "ENABLE_MEMORY_MONITORING",
  ];

  static validate() {
    const missing = this.requiredVars.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      console.error("────────────────────────────────────────────");
      console.error("✗ Missing required environment variables:");
      missing.forEach((key) => console.error(`  - ${key}`));
      console.error("────────────────────────────────────────────");
      console.error("Please check your .env file. See .env.example for reference.");
      process.exit(1);
    }

    // Warn about unset optional vars in development
    if (process.env.ENV === "development" || process.env.DEBUG === "true") {
      const unset = this.optionalVars.filter((key) => process.env[key] === undefined);
      if (unset.length > 0) {
        console.warn("⚠ Optional environment variables not set (using defaults):");
        unset.forEach((key) => console.warn(`  - ${key}`));
      }
    }

    console.log("✓ Environment variables validated successfully");
  }
}

EnvValidator.validate();
