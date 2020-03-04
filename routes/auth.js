const Router = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const SETTINGS = require("../settings");
const registerMail = require("../mail/register");
const router = new Router();
var options = {
  auth: {
    api_key: SETTINGS.mailKey
  }
};

var mailer = nodemailer.createTransport(sgTransport(options));

router.get("/", (req, res) => {
  res.render("auth", {
    title: "Enter",
    isLogin: true,
    registerErr: req.flash("registerErr"),
    loginErr: req.flash("loginErr")
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
      const isAuth = await bcrypt.compare(password, candidate.password);
      if (isAuth) {
        req.session.approved = true;
        req.session.user = candidate;
        req.session.save(err => {
          if (err) throw err;
          res.redirect("/");
        });
      } else {
        req.flash("loginErr", "wrong password");
        res.redirect("/auth");
      }
    }
    if (!candidate) {
      req.flash("loginErr", "user with the same name does not exist");
      res.redirect("/auth");
    }
  } catch (err) {
    console.log(err);
  }
});
router.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      req.flash("registerErr", "user with such email already exists");
      res.redirect("/auth#register");
    }
    if (!candidate) {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, name, password: hashPassword });
      await user.save();
    }
    res.redirect("/auth");
    await mailer.sendMail(registerMail(email));
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = router;
