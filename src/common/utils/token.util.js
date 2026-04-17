const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Constants = require("./constants");

/**
 * Token service for managing JWT, custom AES, and refresh tokens
 */
class TokenUtil {
  // JWT ACCESS TOKEN
  static jwtSecret = process.env.accessTokenKey;
  static jwtExpire = Constants.token.jwtExpire;

  // Refresh Token
  static refreshBytes = Constants.token.refreshBytes;
  static refreshSecret = process.env.refreshTokenKey || crypto.randomBytes(Constants.token.fallbackSecretBytes).toString("hex");
  static refreshExpireMs = Constants.token.refreshExpireMs;

  // Custom AES Token
  static aesExpireMs = Constants.token.aesExpireMs;
  static aesSalt = process.env.AES_SALT || crypto.randomBytes(Constants.token.aesSaltBytes).toString("hex");
  static aesKey = (() => {
    if (!process.env.accessTokenKey) {
      throw new Error("Missing required env variable: accessTokenKey");
    }
    return crypto.pbkdf2Sync(
      process.env.accessTokenKey,
      TokenUtil.aesSalt,
      Constants.token.pbkdf2Iterations,
      Constants.token.pbkdf2KeyLength,
      Constants.token.pbkdf2Digest,
    );
  })();
  static algorithm = Constants.token.aesAlgorithm;

  // =========================================================
  //                    JWT ACCESS TOKEN
  // =========================================================

  /**
   * Create JWT access token
   * @param {Object} payload - Token payload
   * @returns {string} JWT token
   */
  static createJwtAccessToken(payload) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpire,
      algorithm: Constants.token.jwtAlgorithm,
    });
  }

  /**
   * Verify JWT access token
   * @param {string} token - JWT token to verify
   * @returns {Object} Result object with ok flag and data/error
   */
  static verifyJwtAccessToken(token) {
    try {
      return { ok: true, data: jwt.verify(token, this.jwtSecret) };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  // =========================================================
  //              CUSTOM AES ENCRYPTED TOKEN
  // =========================================================

  /**
   * Create custom AES encrypted token
   * @param {Object} data - Data to encrypt
   * @returns {string} Encrypted token in base64
   */
  static createCustomToken(data) {
    const iv = crypto.randomBytes(Constants.token.aesIvBytes);
    const cipher = crypto.createCipheriv(this.algorithm, this.aesKey, iv);

    const payload = {
      data,
      iat: Date.now(),
      exp: Date.now() + this.aesExpireMs,
    };

    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(payload), "utf8"),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([iv, tag, encrypted]).toString("base64");
  }

  /**
   * Verify custom AES encrypted token
   * @param {string} token - Encrypted token to verify
   * @returns {{ ok: boolean, data?: any, error?: string }} Result object with ok flag and data/error
   */
  static verifyCustomToken(token) {
    try {
      const raw = Buffer.from(token, "base64");
      const iv = raw.slice(0, Constants.token.aesIvBytes);
      const tag = raw.slice(Constants.token.aesIvBytes, Constants.token.aesIvBytes + Constants.token.aesTagBytes);
      const encrypted = raw.slice(Constants.token.aesIvBytes + Constants.token.aesTagBytes);

      const decipher = crypto.createDecipheriv(this.algorithm, this.aesKey, iv);
      decipher.setAuthTag(tag);

      const data = JSON.parse(
        Buffer.concat([
          decipher.update(encrypted),
          decipher.final(),
        ]).toString(),
      );

      if (data.exp < Date.now()) {
        return { ok: false, error: "TOKEN_EXPIRED" };
      }

      return { ok: true, data: data.data };
    } catch (err) {
      return { ok: false, error: "TOKEN_INVALID" };
    }
  }

  // =========================================================
  //         REFRESH TOKEN (CREATE + VERIFICATION)
  // =========================================================

  /**
   * Create refresh token
   * @returns {string} Refresh token
   */
  static createRefreshToken() {
    const random = crypto.randomBytes(this.refreshBytes).toString("base64");
    const exp = Date.now() + this.refreshExpireMs;

    const signature = crypto
      .createHmac("sha256", this.refreshSecret)
      .update(random + "." + exp)
      .digest("base64");

    return `${random}.${exp}.${signature}`;
  }

  /**
   * Verify refresh token
   * @param {string} refreshToken - Refresh token to verify
   * @returns {{ ok: boolean, data?: any, error?: string }} Result object with ok flag and data/error
   */
  static verifyRefreshToken(refreshToken) {
    try {
      const parts = refreshToken.split(".");
      if (parts.length !== 3) {
        return { ok: false, error: "invalid_format" };
      }

      const [random, expStr, signature] = parts;
      const exp = parseInt(expStr, 10);

      // Check expiry
      if (Date.now() > exp) {
        return { ok: false, error: "refresh_expired" };
      }

      // Recalculate signature
      const expectedSig = crypto
        .createHmac("sha256", this.refreshSecret)
        .update(random + "." + exp)
        .digest("base64");

      // timing-safe compare
      if (
        !crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expectedSig),
        )
      ) {
        return { ok: false, error: "invalid_signature" };
      }

      return { ok: true };
    } catch (err) {
      return { ok: false, error: "invalid_refresh_token" };
    }
  }
}

module.exports = TokenUtil;
