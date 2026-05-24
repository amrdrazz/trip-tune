const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  username: String,
  password: String,
  personality: String,
  verificationCode: Number,
  verified: Boolean
}, {
  timestamps: true
});




const User = mongoose.model("User", userSchema);

module.exports = User;