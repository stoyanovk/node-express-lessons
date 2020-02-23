const { Router } = require("express");
const router = Router();
const Course = require("../models/Course");
const User = require("../models/User");

router.get("/", async (req, res) => {
  const courses = await Course.find().populate({
    path: "userId",

    select: "name email"
  });

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

router.post("/edit", async (req, res) => {
  try {
    const { id, ...rest } = req.body;
    console.log(id);
    await Course.findByIdAndUpdate(id, rest);
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});
router.post("/delete", async (req, res) => {
  console.log("delete");
  const { id } = req.body;
  try {
    await Course.findByIdAndDelete({ _id: id });
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});
router.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const course = await Course.findById(id);
  res.render("edit", {
    course
  });
});

module.exports = router;
