const { Schema, model } = require("mongoose");

const Course = new Schema({
  title: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  label: {
    type: String,
    require: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = model("Course", Course);
