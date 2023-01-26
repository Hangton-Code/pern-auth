"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import dependencies
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const errorHandler_1 = require("../helpers/errorHandler");
const googleLoginUrl_1 = __importDefault(require("../helpers/googleLoginUrl"));
const checkAuth_1 = __importDefault(require("../middlewares/checkAuth"));
const validationHandler_1 = __importDefault(require("../middlewares/validationHandler"));
// config route
const router = (0, express_1.Router)();
router.post("/login", (0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("password").isString(), validationHandler_1.default, (0, errorHandler_1.use)(authController_1.loginController));
router.post("/signup_email", (0, express_validator_1.body)("email").isEmail(), validationHandler_1.default, (0, errorHandler_1.use)(authController_1.signupEmailController)); // send email to user to confirm for signing up
router.post("/signup", (0, express_validator_1.body)("token").isJWT(), (0, express_validator_1.body)("password").isString().isLength({
    min: 8,
    max: 30,
}), validationHandler_1.default, (0, errorHandler_1.use)(authController_1.signupController));
router.post("/refresh_token", (0, express_validator_1.body)("refresh_token").isJWT(), validationHandler_1.default, (0, errorHandler_1.use)(authController_1.refreshTokenController));
router.post("/logout", (0, express_validator_1.body)("refresh_token").isJWT(), validationHandler_1.default, (0, errorHandler_1.use)(authController_1.logoutController));
router.post("/set_password_email", (0, express_validator_1.body)("email").isEmail(), validationHandler_1.default, (0, errorHandler_1.use)(authController_1.setPasswordEmailController));
router.post("/set_password", (0, express_validator_1.body)("token").isJWT(), (0, express_validator_1.body)("password").isString().isLength({
    min: 8,
    max: 30,
}), validationHandler_1.default, (0, errorHandler_1.use)(authController_1.setPasswordController));
router.get("/me", checkAuth_1.default, (req, res) => {
    res.json({
        message: "success",
        body: {
            user: Object.assign(Object.assign({}, req.user), { password: null }),
        },
    });
});
// google
router.get("/google/login", (req, res) => res.redirect(googleLoginUrl_1.default));
router.get("/google/redirect", (0, express_validator_1.query)("code").isString(), validationHandler_1.default, (0, errorHandler_1.use)(authController_1.googleRedirect));
// export router
exports.default = router;
