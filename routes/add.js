const { Router } = require("express");
const path = require("path");
const Course = require("../models/Course");
const router = Router();

router.get("/", (req, res) => {
  res.render("add", {
    title: "add Courses"
  });
});
router.post("/", (req, res) => {
  const course = new Course(req.body.title, req.body.price, req.body.label);
  course.save()
  res.redirect("/courses");
});

module.exports = router;
