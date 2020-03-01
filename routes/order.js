const { Router } = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const router = Router();

router.get("/", auth, async (req, res) => {
  const orders = await Order.find({
    "user.userId": req.session.user._id
  }).populate("items.userId");

  const resultCourses = orders.map(o => {
    const courses = o.courses.map(c => {
      return {
        ...c._doc,
        totalPrice: c.course.price * c.count
      };
    });

    return { ...o._doc, courses };
  });

  res.render("order", {
    title: "Order",
    orders: resultCourses
  });
});

router.post("/", auth, async (req, res) => {
  const courses = await req.session.user.cart
    .populate("items.courseId")
    .execPopulate();

  const resultCourses = courses.items.map(item => {
    return { count: item.count, course: item.courseId._doc };
  });
  console.log(resultCourses);
  const order = new Order({
    courses: resultCourses,
    user: {
      name: req.session.user.name,
      userId: req.session.user
    }
  });
  await order.save();
  req.session.user.clearCart();
  res.redirect("/order");
});

module.exports = router;
