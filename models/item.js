const mongoose = require("mongoose");
const User = require("./user");

const itemSchema = new mongoose.Schema({
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  category: String,
  nameItems: String,
  describe: String,
  linkPhoto: String,
  price: Number,
});

itemSchema.statics.show = async function () {
  if (status) {
    return this.find()
  }
  return this.find({ authorID: req.session.user.id })
}
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
