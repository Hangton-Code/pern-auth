// import dependencies
import { Router } from "express";
import { body, query } from "express-validator";
import {
  loginController,
  signupEmailController,
  signupController,
  refreshTokenController,
  logoutController,
  googleRedirect,
  setPasswordController,
  setPasswordEmailController,
} from "../controllers/authController";
import { use } from "../helpers/errorHandler";
import googleLoginUrl from "../helpers/googleLoginUrl";
import checkAuth from "../middlewares/checkAuth";
import validationHandler from "../middlewares/validationHandler";

// config route
const router = Router();

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isString(),
  validationHandler,
  use(loginController)
);
router.post(
  "/signup_email",
  body("email").isEmail(),
  validationHandler,
  use(signupEmailController)
); // send email to user to confirm for signing up
router.post(
  "/signup",
  body("token").isJWT(),
  body("password").isString().isLength({
    min: 8,
    max: 30,
  }),
  validationHandler,
  use(signupController)
);
router.post(
  "/refresh_token",
  body("refresh_token").isJWT(),
  validationHandler,
  use(refreshTokenController)
);
router.post(
  "/logout",
  body("refresh_token").isJWT(),
  validationHandler,
  use(logoutController)
);
router.post(
  "/set_password_email",
  body("email").isEmail(),
  validationHandler,
  use(setPasswordEmailController)
);
router.post(
  "/set_password",
  body("token").isJWT(),
  body("password").isString().isLength({
    min: 8,
    max: 30,
  }),
  validationHandler,
  use(setPasswordController)
);
router.get("/me", checkAuth, (req, res) => {
  res.json({
    message: "success",
    body: {
      user: {
        ...req.user,
        password: null,
      },
    },
  });
});

// google
router.get("/google/login", (req, res) => res.redirect(googleLoginUrl));
router.get(
  "/google/redirect",
  query("code").isString(),
  validationHandler,
  use(googleRedirect)
);

// export router
export default router;
