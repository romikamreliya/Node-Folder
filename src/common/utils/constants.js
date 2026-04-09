class Constants {
  static defaultPageLimit = 10;
  static defaultLanguage = "en";

  static userType = {
    admin: "Admin",
    user: "User",
    publisher: "Publisher",
  };
  static statusCode = {
    success: 200,
    error: 500,
  };
  static tokenType = {
    api: "api",
    web: "web",
  };
}

module.exports = Constants;
