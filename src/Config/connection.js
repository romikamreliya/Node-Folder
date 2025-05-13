const knex = require("knex");

let DBKnex;
if (process.env.DBTYPE == "sqlite") {
  DBKnex = knex({
    client: 'sqlite3',
    connection: {
      filename: process.env.DBFILE
    },
    useNullAsDefault: true,
  });
} else if(process.env.DBTYPE == "mysql") {
  DBKnex = knex({
    client: "mysql",
    port: process.env.DBPORT,
    connection: {
      host: process.env.DBHOST,
      database: process.env.DBNAME,
      user: process.env.DBUSER,
      password: process.env.DBPASS,
    },
  });
}

module.exports = DBKnex;
