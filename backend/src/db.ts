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
});

export default db;
