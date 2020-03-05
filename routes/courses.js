const { Router } = require("express");
const router = Router();
const Course = require("../models/Course");
const securityMiddleware = require("../middleware/security");


router.get("/", async (req, res) => {
  const courses = await Course.find().populate({
    path: "userId",
    select: "name email _id"
  });

  res.render("courses", {
    title: "Courses",
    courses,
    currentUserID: req.session.user ? req.session.user._id : null
  });
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const course = await Course.findById(id);

  res.render("course", {
    course
  });
});

router.get("/:id/edit", securityMiddleware, async (req, res) => {
  res.render("edit", {
    course: req.course
  });
});

router.post("/edit", securityMiddleware, async (req, res) => {
  try {
    const { id, ...rest } = req.body;
    await Course.findByIdAndUpdate(id, rest);
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});
router.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await Course.findByIdAndDelete({ _id: id });
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
