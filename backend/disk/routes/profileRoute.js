"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import dependencies
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const profileController_1 = require("../controllers/profileController");
const errorHandler_1 = require("../helpers/errorHandler");
const checkAuth_1 = __importDefault(require("../middlewares/checkAuth"));
const validationHandler_1 = __importDefault(require("../middlewares/validationHandler"));
const multer_1 = __importDefault(require("../multer"));
// config router
const router = (0, express_1.Router)();
router.post("/edit", (0, express_validator_1.body)("user_name").optional().isLength({
    min: 6,
    max: 30,
}), validationHandler_1.default, checkAuth_1.default, (0, errorHandler_1.use)(profileController_1.editProfileController));
const allowedAvatarExt = [".png", ".jpg", ".jpeg", ".gif"];
const maxAvatarSize = 3 * 1024 * 1024; // 3MB
router.post("/edit/avatar", checkAuth_1.default, (0, multer_1.default)(allowedAvatarExt, maxAvatarSize).single("image"), (0, express_validator_1.body)("avatar_type").optional().toInt().isIn([0, 1, 2]), (0, express_validator_1.body)("avatar_url").optional().isURL(), validationHandler_1.default, (0, errorHandler_1.use)(profileController_1.editAvatarController));
router.get("/avatar/:key", (0, errorHandler_1.use)(profileController_1.getAvatarController));
router.get("/:requested_id", (0, errorHandler_1.use)(profileController_1.getProfileController));
// export router
exports.default = router;
