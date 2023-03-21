const express = require("express");
const router = express.Router();
const ctrl = require("../../controlers/contacts");
const {
  validateBody,
  isValidId,
  authentificate,
} = require("../../middlewares/index");

const { schemas } = require("../../models/contact");

router.get("/", authentificate, ctrl.getAllContacts);

router.get("/:id", authentificate, isValidId, ctrl.getContactById);

router.post(
  "/",
  authentificate,
  validateBody(schemas.addSchema),
  ctrl.addContact
);

router.put(
  "/:id",
  authentificate,
  validateBody(schemas.updateSchema),
  ctrl.updateContact
);

router.patch(
  "/:id/favorite",
  isValidId,
  authentificate,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

router.delete("/:id", authentificate, ctrl.deleteContact);

module.exports = router;
