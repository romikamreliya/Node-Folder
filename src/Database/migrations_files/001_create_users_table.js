/**
 * Migration: Create Users Table
 * Version: 001
 * Created: 2026-03-17
 */

module.exports = {
  name: "001_create_users_table",
  up: async (knex) => {
    const exists = await knex.schema.hasTable("user");
    if (!exists) {
      return knex.schema.createTable("user", (table) => {
        table.increments("id").primary();
        table.string("name", 100).notNullable();
        table.string("email", 100).notNullable().unique();
        table.string("phone", 20).notNullable();
        table.string("password", 255).nullable();
        table.enum("status", ["active", "inactive", "blocked"]).defaultTo("active");
        table.text("notes").nullable();
        table.timestamp("updated_at").defaultTo(knex.fn.now());
        table.timestamp("created_at").defaultTo(knex.fn.now());
      });
    }
  },
  down: async (knex) => {
    // Drop table on rollback
    return knex.schema.dropTableIfExists("user");
  }
}
