const Router = require("express");
const User = require("../models/User");
const router = new Router();

router.get("/", (req, res) => {
  res.render("auth", {
    title: "Enter",
    isLogin: true
  });
});
router.get("/exit", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.post("/login", async (req, res) => {
  const user = await User.findById({ _id: "5e5132347ea57f111c4241db" });
  req.session.approved = true;
  req.session.user = user;
  req.session.save(err => {
    if (err) console.log(err);
    res.redirect("/");
  });
});
module.exports = router;
