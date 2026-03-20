const knex = require("knex");

let DBKnex;

try {
  if (process.env.DB_TYPE === "sqlite") {
    DBKnex = knex({
      client: 'sqlite3',
      connection: {
        filename: process.env.DBFILE
      },
      useNullAsDefault: true
    });
  } else if (process.env.DB_TYPE === "mysql") {
    DBKnex = knex({
      client: "mysql",
      port: process.env.DBPORT,
      connection: {
        host: process.env.DBHOST,
        database: process.env.DBNAME,
        user: process.env.DBUSER,
        password: process.env.DBPASS
      },
      pool: { 
        min: 2,
        max: 10,
        // Validate connections
        validateConnection: (connection) => {
          return connection.ping().then(() => connection);
        }
      },
      acquireTimeoutMillis: 30000
    });
  } else {
    throw new Error(`Unsupported database type: ${process.env.DB_TYPE}`);
  }
} catch (error) {
  console.error("Database connection error:", error.message);
  process.exit(1);
}

module.exports = DBKnex;
