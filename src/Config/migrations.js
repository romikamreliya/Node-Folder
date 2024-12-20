require("dotenv").config();
const DBknex = require("./connection");

DBknex.schema.createTable("user", (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable();
    table.string("email", 100).notNullable();
    table.string("phone", 100).notNullable();
    table.timestamp("updated_at").defaultTo(DBknex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.timestamp("created_at").defaultTo(DBknex.fn.now());
}).then(() => {
    console.log("Table created successfully: user");
}).catch((error) => {
    console.error("Error creating table:", error);
});
