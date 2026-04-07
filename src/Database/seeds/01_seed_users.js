/**
 * Seed: Users Table
 * Version: 01
 * Inserts sample user data
 */

module.exports = {
  tableName: "user",
  seed: async (knex) => {
    // Delete existing entries
    await knex("user").del();
    
    // Insert sample data
    const users = [
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        password: null,
        status: "active",
        notes: "Sample user 1"
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1 (555) 234-5678",
        password: null,
        status: "active",
        notes: "Sample user 2"
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        phone: "+1 (555) 345-6789",
        password: null,
        status: "active",
        notes: "Sample user 3"
      },
      {
        name: "Alice Williams",
        email: "alice@example.com",
        phone: "+1 (555) 456-7890",
        password: null,
        status: "inactive",
        notes: "Sample user 4"
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        phone: "+1 (555) 567-8901",
        password: null,
        status: "active",
        notes: "Sample user 5"
      }
    ];

    return knex("user").insert(users);
  }
}