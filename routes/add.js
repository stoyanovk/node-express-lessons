const { Router } = require("express");
const auth = require("../middleware/auth");
const Course = require("../models/Course");
const router = Router();

router.get("/", auth, (req, res) => {
  res.render("add", {
    title: "add Courses"
  });
});
router.post("/", async (req, res) => {
  try {
    const course = new Course({
      title: req.body.title,
      price: req.body.price,
      label: req.body.label,
      userId: req.user
    });
    await course.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
