import { Client } from "pg";
require("dotenv").config();

const db = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(() => {
  console.log("Connected to PostgresSQL Database");
  db.query("select 1 + 1").then((res) => {
    console.log(res);
  });
});

export default db;
