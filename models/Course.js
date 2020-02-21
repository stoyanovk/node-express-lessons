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
  // _id: String
});

module.exports = model("Course", Course);
