/**
 * Seeder: user
 */
module.exports = {
  tableName: "user", // Specify the table name
  seed: async (conn) => {
    // Write seed code here
    // Example:
    await conn.user.createMany({
      data: [
        { name: 'John Doe', email: 'john.doe001@example.com' },
      ]
    });
  }
};
