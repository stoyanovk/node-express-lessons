const { Router } = require("express");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");

const router = new Router();

router.get("/", auth, (req, res) => {
  const { user } = req.session;

  res.render("profile", {
    title: "profile",
    user
  });
});

router.post("/", auth, async (req, res) => {
  try {
    const { user } = req.session;
    if (req.body.name) user.name = req.body.name;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.file) {
      user.avatarUrl = req.file.path;
    }
    await user.save();
    res.redirect("/profile");
  } catch (e) {
    throw new Error(e);
  }
});
module.exports = router;
//
