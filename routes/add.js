const { Router } = require("express");
const path = require("path");
const Course = require("../models/Course");
const router = Router();

router.get("/", (req, res) => {
  res.render("add", {
    title: "add Courses"
  });
});
router.post("/", async (req, res) => {
  try {
    const course = new Course({
      title: req.body.title,
      price: req.body.price,
      label: req.body.label
    });
    await course.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
