// TokenService.js
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class TokenService {
  constructor() {

    // JWT ACCESS TOKEN
    this.jwtSecret = process.env.accessTokenKey;
    this.jwtExpire = "15m";

    // Refresh Token
    this.refreshBytes = parseInt(64, 10);
    this.refreshSecret = process.env.refressTokenKey;
    this.refreshExpireMs = parseInt(7 * 24 * 60 * 60 * 1000); // 7 days

    // Custom AES Token
    this.aesExpireMs = parseInt(24 * 60 * 60 * 1000); // 24 hours
    this.aesKey = Buffer.concat([Buffer.from(process.env.accessTokenKey || "", "base64"),Buffer.alloc(32)]).subarray(0, 32);
    this.algorithm = "aes-256-gcm";
  }

  // =========================================================
  //                    🔥 JWT ACCESS TOKEN
  // =========================================================
  createJwtAccessToken(payload) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpire,
      algorithm: "HS256",
    });
  }

  verifyJwtAccessToken(token) {
    try {
      return { ok: true, data: jwt.verify(token, this.jwtSecret) };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  // =========================================================
  //              🔥 CUSTOM AES ENCRYPTED TOKEN
  // =========================================================
  createCustomToken(data) {
    const iv = crypto.randomBytes(12);
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

  verifyCustomToken(token) {
    try {
      const raw = Buffer.from(token, "base64");
      const iv = raw.slice(0, 12);
      const tag = raw.slice(12, 28);
      const encrypted = raw.slice(28);

      const decipher = crypto.createDecipheriv(this.algorithm, this.aesKey, iv);
      decipher.setAuthTag(tag);

      const data = JSON.parse(
        Buffer.concat([decipher.update(encrypted), decipher.final()]).toString()
      );

      if (data.exp < Date.now()) {
        return { ok: false, error: "custom_token_expired" };
      }

      return { ok: true, data: data.data };
    } catch (err) {
      return { ok: false, error: "invalid_custom_token" };
    }
  }

  // =========================================================
  //         🔥 REFRESH TOKEN (CREATE + VERIFICATION)
  // =========================================================

  // Create Token
  createRefreshToken() {
    const random = crypto.randomBytes(this.refreshBytes).toString("base64");
    const exp = Date.now() + this.refreshExpireMs;

    const signature = crypto
      .createHmac("sha256", this.refreshSecret)
      .update(random + "." + exp)
      .digest("base64");

    return `${random}.${exp}.${signature}`;
  }

  // Verify Token
  verifyRefreshToken(refreshToken) {
    try {
      const parts = refreshToken.split(".");
      if (parts.length !== 3)
        return { ok: false, error: "invalid_format" };

      const [random, expStr, signature] = parts;
      const exp = parseInt(expStr, 10);

      // Check expiry
      if (Date.now() > exp)
        return { ok: false, error: "refresh_expired" };

      // Recalculate signature
      const expectedSig = crypto
        .createHmac("sha256", this.refreshSecret)
        .update(random + "." + exp)
        .digest("base64");

      // timing-safe compare
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
        return { ok: false, error: "invalid_signature" };
      }

      return { ok: true };
    } catch (err) {
      return { ok: false, error: "invalid_refresh_token" };
    }
  }
}

module.exports = new TokenService();
