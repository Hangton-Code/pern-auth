"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import dependencies
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./helpers/errorHandler");
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
// config server
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
}));
app.use(express_1.default.json());
app.use("/api/auth", authRoute_1.default);
app.use("/api/profile", profileRoute_1.default);
app.use(errorHandler_1.errorHandler);
// server to listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server start listening on ${PORT}`);
});
