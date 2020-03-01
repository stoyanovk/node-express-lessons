const Router = require("express");
const bcrypt = require("bcrypt");
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
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    
    if (candidate) {
      const isAuth = await bcrypt.compare(password, candidate.password)
      if (isAuth) {
        req.session.approved = true;
        req.session.user = candidate;
        req.session.save(err => {
          if (err) throw err;
          res.redirect("/");
        });
      } else {
        res.redirect("/auth");
      }
    }
    if (!candidate) {
      res.redirect("/auth");
    }
  } catch (err) {
    console.log(err);
  }
});
router.post("/register", async (req, res) => {
  try {
    const { email, name, password, copypassword } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      res.redirect("/auth#register");
    }
    if (!candidate) {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, name, password: hashPassword });
      await user.save();
    }
    res.redirect("/auth");
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = router;
