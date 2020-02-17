const { Schema, model } = require("mongoose");

const Course = new Schema({
  title: {
    type: String,
    require
  },
  price: {
    type: Number
  },
  label: String
});

module.exports = model("Course", Course);
