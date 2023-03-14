const express = require("express");
const router = express.Router();
const ctrl = require("../../controlers/contacts");
const { validateBody, isValidId } = require("../../middlewares/index");
const { schemas } = require("../../models/contact");
router.get("/", ctrl.getAllContacts);

router.get("/:id", isValidId, ctrl.getContactById);

router.post("/", isValidId, validateBody(schemas.addSchema), ctrl.addContact);

router.put("/:id", validateBody(schemas.updateSchema), ctrl.updateContact);

router.patch(
  "/:id/favourite",
  isValidId,
  validateBody(schemas.updateFavoureteSchema),
  ctrl.updateStatusContact
);

router.delete("/:id", ctrl.deleteContact);

module.exports = router;
