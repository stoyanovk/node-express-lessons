const { Schema, model } = require("mongoose");
const user = new Schema({
  name: String,
  password: {
    type: String,
    required: true
  },
  avatarUrl: String,
  email: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExp: Date,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        courseId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Course"
        }
      }
    ]
  }
});

user.methods.addToCart = function(course) {
  const items = [...this.cart.items];

  const cartItemIndex = items.findIndex(
    item => item.courseId.toString() === course._id.toString()
  );

  if (cartItemIndex >= 0) {
    items[cartItemIndex].count = items[cartItemIndex].count + 1;
  }
  if (cartItemIndex < 0) {
    items.push({
      courseId: course._id,
      count: 1
    });
  }
  this.cart = { items };

  return this.save();
};

user.methods.removeCourse = function(id) {
  let items = [...this.cart.items];

  const cartItem = items.find(item => {
    return item.courseId.toString() === id;
  });

  if (cartItem.count > 1) {
    items[cartItemIndex].count--;
  }

  if (cartItem.count === 1) {
    items = items.filter(item => item.courseId.toString() !== id);
  }
  this.cart = { items };
  return this.save();
};

user.methods.clearCart = function() {
  this.cart.items = [];
  this.save();
};
module.exports = model("User", user);
