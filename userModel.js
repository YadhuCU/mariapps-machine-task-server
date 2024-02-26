const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  place: { type: String },
  liveIn: { type: String },
  homeTown: { type: String },
  education: { type: String },
  language: { type: String },
  bio: { type: String },
});

const users = mongoose.model("users", userSchema);

module.exports = users;
