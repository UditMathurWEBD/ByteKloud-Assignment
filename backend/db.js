import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Users",
  password: "admin",
  port: 5433, 
});

db.connect();

export default db;
