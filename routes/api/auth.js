const express = require("express");
const router = express.Router();
const {
  authentificate,
  validateBody,
  upload,
} = require("../../middlewares/index");
const { schemas } = require("../../models/user");
const ctrl = require("../../controlers/auth");

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.get("/verify/:verificationCode", ctrl.verifyEmail);

router.get(
  "/verify",
  validateBody(schemas.emailSchema),
  ctrl.resentVerifyEmail
);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.post(
  "/logout",
  authentificate,
  validateBody(schemas.logoutSchema),
  ctrl.logout
);

router.post("/current", authentificate, ctrl.getCurrent);

router.patch(
  "/avatar",
  authentificate,
  upload.single("avatar"),
  ctrl.updateAvatar
);
module.exports = router;
