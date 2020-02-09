const { Router } = require("express");
const router = Router();
const Course = require("../models/Course");

router.get("/", async (req, res) => {
  const courses = await Course.read();
  res.render("courses", {
    title: "Courses",
    courses
  });
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const course = await Course.getById(id);

  res.render("course", {
    course
  });
});

router.post("/edit", (req, res) => {
  Course.update(req.body);
  res.redirect('/courses')
});
router.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const course = await Course.getById(id);
  res.render("edit", {
    course
  });
});

module.exports = router;
