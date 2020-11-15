const mongoose = require("mongoose");
const user = new mongoose.Schema({
  username: String,
  password: String,
  favorites: Array
});

module.exports = mongoose.model("User", user);
