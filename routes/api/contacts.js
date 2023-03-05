const express = require("express");
const router = express.Router();
const ctrl = require("../../controlers/contacts");
const { validateBody } = require("../../middlewares/index");
const schema = require("../../schemas/contacts");
router.get("/", ctrl.getAllContacts);

router.get("/:id", ctrl.getContactById);

router.post("/", validateBody(schema.addSchema), ctrl.addContact);

router.put("/:id", validateBody(schema.updateSchema), ctrl.updateContact);

router.delete("/:id", ctrl.deleteContact);

module.exports = router;
