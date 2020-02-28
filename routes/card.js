const { Router } = require("express");
const Course = require("../models/Course");
const User = require("../models/User");
const router = Router();

function getSumPrice(courses) {
  let totalPrice = 0;
  courses.forEach(({ price, count }) => {
    totalPrice = totalPrice + price * count;
  });
  return totalPrice;
}

router.get("/", async (req, res) => {
  console.dir(req.session.user);
  const cart = await req.session.user
    .populate("cart.items.courseId")
    .execPopulate();

  const resCart = cart.cart.items.map(item => ({
    ...item.courseId._doc,
    count: item.count
  }));
  const price = getSumPrice(resCart);

  res.render("card", {
    title: "card",
    card: resCart,
    price
  });
});

router.post("/add", async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect("/card");
});

router.delete("/remove/:id", async (req, res) => {
  await req.user.removeCourse(req.params.id);
  const user = await req.user.cart.populate("items.courseId").execPopulate();
  const result = user.items.map(item => {
    return { ...item.courseId._doc, count: item.count };
  });

  res.status(200).json({ courses: result, totalPrice: getSumPrice(result) });
  res.redirect("/card");
});
module.exports = router;
