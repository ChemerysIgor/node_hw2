const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers/index");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  console.log(owner);
  const result = await Contact.find({ owner }, "-createdAt, -updateAt");
  res.json(result);
};

const getContactById = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json({
    name: newContact.name,
    email: newContact.email,
    phone: newContact.phone,
    owner: newContact.owner,
  });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate(
    { contactId, owner },
    req.body,
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate(
    { contactId, owner },
    req.body,
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404, "Missing field favorite");
  }
  res.json(result);
};
const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndDelete({ contactId, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    message: "Delete success",
  });
};
module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleteContact: ctrlWrapper(deleteContact),
};
