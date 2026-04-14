const crypto = require("crypto");

class PasswordUtil {
  static hash(password) {
    if (typeof password !== "string" || password.length === 0) {
      throw new Error("Password is required");
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");

    return `${salt}:${derivedKey}`;
  }

  static verify(password, hashedPassword) {
    if (
      typeof password !== "string" ||
      typeof hashedPassword !== "string" ||
      !hashedPassword.includes(":")
    ) {
      return false;
    }

    const [salt, storedHash] = hashedPassword.split(":");
    const computedHash = crypto.scryptSync(password, salt, 64).toString("hex");

    return crypto.timingSafeEqual(
      Buffer.from(storedHash, "hex"),
      Buffer.from(computedHash, "hex"),
    );
  }
}

module.exports = PasswordUtil;
