const knex = require("knex");

module.exports = knex({
  client: "mysql",
  port: 3306,
  connection: {
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
  },
});
