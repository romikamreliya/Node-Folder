class StaticKey {
  UserType = {
    admin: "Admin",
    user: "User",
    publisher: "Publisher",
  };
  ResCode = {
    success: 200,
    error: 500,
  }
}

module.exports = new StaticKey();
