// import dependencies
import express from "express";
import { errorHandler } from "./helpers/errorHandler";
import authRoute from "./routes/authRoute";
import profileRoute from "./routes/profileRoute";
import cors from "cors";
require("dotenv").config();
import path from "path";

// config server
const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: ["http://localhost:3000"],
    })
  );
}
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use(errorHandler);
if (process.env.NODE_ENV === "production") {
  app.use("/static", express.static(path.join(__dirname, "../client//static")));
  app.get("*", function (req, res) {
    res.sendFile("index.html", { root: path.join(__dirname, "../client/") });
  });
}

// server to listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server start listening on ${PORT}`);
});
