class I18nUtil {
  static defaultLanguage = process.env.default_language || "en";

  static t({ key, len = this.defaultLanguage }) {
    const messagesByLanguage = require(`../../language/${len}/message.js`);
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
