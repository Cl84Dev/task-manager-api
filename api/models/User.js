const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: String,
  name: String,
  password: String,
  email: String,
  recover: String,
  email_checked: Boolean,
});

module.exports = User;
