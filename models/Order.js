const { Schema, model } = require("mongoose");

const Order = new Schema({
  courses: [
    {
      course: {
        isRequired: true,
        type: Object
      },
      count: {
        isRequired: true,
        type: Number
      }
    }
  ],
  user: {
    name: String,
    userId: {
      type: Schema.Types.ObjectId,
      for: "User",
      required: true
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = model("Order", Order);
