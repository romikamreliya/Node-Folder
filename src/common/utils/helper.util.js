/**
 * Helper utilities for common operations
 */
class HelperUtil {
  
  static parseBoolean(value) {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "number") {
      if (value === 1) return true;
      if (value === 0) return false;
      return value;
    }

    if (typeof value === "string") {
      const normalizedValue = value.trim().toLowerCase();
      if (["true", "1", "yes", "on"].includes(normalizedValue)) {
        return true;
      }
      if (["false", "0", "no", "off"].includes(normalizedValue)) {
        return false;
      }
      return value;
    }

    return value;
  }  
  

}

module.exports = HelperUtil;
