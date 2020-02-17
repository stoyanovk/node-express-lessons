const { Router } = require("express");
const router = Router();
const Course = require("../models/Course");

router.get("/", async (req, res) => {
  const courses = await Course.find();

  res.render("courses", {
    title: "Courses",
    courses
  });
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const course = await Course.findById(id);

  res.render("course", {
    course
  });
});

router.post("/edit", (req, res) => {
  const { id, ...rest } = req.body;
  // console.dir(req.body);
  Course.findByIdAndUpdate(id, rest);
  res.redirect("/courses");
});
router.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const course = await Course.findById(id);
  res.render("edit", {
    course
  });
});

module.exports = router;
