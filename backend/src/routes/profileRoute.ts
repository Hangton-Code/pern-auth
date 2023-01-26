// import dependencies
import { Router } from "express";
import { body } from "express-validator";
import {
  editProfileController,
  getProfileController,
  editAvatarController,
  getAvatarController,
} from "../controllers/profileController";
import { use } from "../helpers/errorHandler";
import checkAuth from "../middlewares/checkAuth";
import validationHandler from "../middlewares/validationHandler";
import upload from "../multer";

// config router
const router = Router();
router.post(
  "/edit",
  body("user_name").optional().isLength({
    min: 6,
    max: 30,
  }),
  validationHandler,
  checkAuth,
  use(editProfileController)
);
const allowedAvatarExt = [".png", ".jpg", ".jpeg", ".gif"];
const maxAvatarSize = 3 * 1024 * 1024; // 3MB
router.post(
  "/edit/avatar",
  checkAuth,
  upload(allowedAvatarExt, maxAvatarSize).single("image"),
  body("avatar_type").optional().toInt().isIn([0, 1, 2]),
  body("avatar_url").optional().isURL(),
  validationHandler,
  use(editAvatarController)
);
router.get("/avatar/:key", use(getAvatarController));
router.get("/:requested_id", use(getProfileController));

// export router
export default router;
