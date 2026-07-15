class I18nUtil {
  static defaultLanguage = process.env.default_language || "en";
  static allowedLanguages = ["en"];

  static t({ key, len = this.defaultLanguage }) {
    // Whitelist validation to prevent path traversal
    const safeLang = this.allowedLanguages.includes(len) ? len : this.defaultLanguage;

    const messagesByLanguage = require(`../../language/${safeLang}/message.js`);
    if (messagesByLanguage[key]) {
      return messagesByLanguage[key];
    }

    const fallbackMessages = require(
      `../../language/${this.defaultLanguage}/message.js`,
    );
    return fallbackMessages[key] || key;
  }
}

module.exports = I18nUtil;
