const { Router } = require("express");
const Order = require("../models/Order");
const router = Router();

router.get("/", async (req, res) => {
  const orders = await Order.find({ "user.userId": req.user._id }).populate(
    "items.userId"
  );
  const resultCourses = orders.map(o => {
    const course = o._doc.courses.map(c => ({
      ...c._doc,
      totalPrice: c._doc.course.price * c._doc.count
    }));

    return course;
  });
  console.dir(resultCourses);

  res.render("order", {
    title: "Order",
    resultCourses
  });
});

router.post("/", async (req, res) => {
  const courses = await req.user.cart.populate("items.courseId").execPopulate();

  const resultCourses = courses.items.map(item => {
    return { count: item.count, course: item.courseId._doc };
  });
  console.log(resultCourses);

  const order = new Order({
    courses: resultCourses,
    user: {
      name: req.user.name,
      userId: req.user
    }
  });
  await order.save();
  req.user.clearCart();
  res.redirect("/order");
});

module.exports = router;
