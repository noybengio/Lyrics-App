const mongoose = require("mongoose");
const user = new mongoose.Schema({
  username: {type:String,required:true},
  password: {type:String,required:true},
  favorites: Array
});

module.exports = mongoose.model("User", user);
