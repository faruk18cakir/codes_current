const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");


const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    email: String,
    role: String,
  },
  { id: false, timestamps: true }
);
userSchema.plugin(autopopulate);

const User = mongoose.model("User", userSchema);

module.exports = User;
