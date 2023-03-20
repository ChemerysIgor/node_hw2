const express = require("express");
const router = express.Router();
const { validateBody } = require("../../middlewares/index");
const { schemas } = require("../../models/user");
const ctrl = require("../../controlers/auth");

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.post("/logout", validateBody(schemas.logoutSchema), ctrl.logout);

router.post("/current", ctrl.getCurrent);

module.exports = router;
