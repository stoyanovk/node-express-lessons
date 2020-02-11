const { Router } = require("express");
const Course = require("../models/Course");
const Card = require("../models/Card");

const router = Router();

router.get("/", async (req, res) => {
  const card = await Card.getCardItems();

  res.render("card", {
    title: "card",
    card
  });
});

router.post("/add", async (req, res) => {
  const id = req.body.id;
  const courses = await Course.read();
  const boughtСourse = courses.find(course => course.id === id);
  Card.saveCourse(boughtСourse);
  res.redirect("/card");
});
module.exports = router;
