const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String }, // URL for category image
});

module.exports = mongoose.model("Category", CategorySchema);
