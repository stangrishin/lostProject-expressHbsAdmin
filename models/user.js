const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  phone: Number,
  nameLombard: String,
  adressLombard: String,
  managerName: String,
  admin: Boolean,
  authorised: Boolean,

  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  },
})

const User = mongoose.model('User', UserSchema);

module.exports = User;
