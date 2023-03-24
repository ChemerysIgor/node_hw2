const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
require("dotenv").config();
const path = require("path");
const fs = require("fs/promises");
const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const { nanoid } = require("nanoid");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}"> CLick verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const resentVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Missing required field email");
  }
  if (user.verify) {
    throw HttpError(401, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Veriy emeil",
    html: `<a href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email send success",
  });
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });
  if (!user) throw HttpError(401, " Email not found");
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });
  res.json({
    message: "Email verify success",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  console.log(passwordCompare);

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }
  const payload = {
    id: user._id,
  };
  console.log("payload:", payload);

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json("Logout success");
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  Jimp.read(tempUpload, async (err, ava) => {
    if (err) throw err;
    await ava.resize(250, 250).writeAsync(tempUpload);
    await fs.rename(tempUpload, resultUpload);
  });

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resentVerifyEmail: ctrlWrapper(resentVerifyEmail),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
};
