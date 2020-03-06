const Router = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const SETTINGS = require("../settings");
const registerMail = require("../mails/register");
const resetMail = require("../mails/reset");
const crypto = require("crypto");
const registerValidators = require("../utils");
const { validationResult } = require("express-validator");
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
router.post("/register", registerValidators, async (req, res) => {
  const { errors } = validationResult(req);
  if (errors.length !== 0) {
    req.flash("registerErr", errors[0].msg);
    return res.status(422).redirect("/auth#register");
  }
  try {
    const { email, name, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, name, password: hashPassword });
    await user.save();

    res.redirect("/auth");
    await mailer.sendMail(registerMail(email));
  } catch (err) {
    throw new Error(err);
  }
});

router.get("/reset", (req, res) => {
  res.render("reset", {
    title: "reset pass",
    error: req.flash("error")
  });
});

router.post("/reset", (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buf) => {
      if (err) {
        req.flash("error", "something went wrong");
        return res.redirect("/auth");
      }
      const token = buf.toString("hex");
      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        res.redirect("/");
        await mailer.sendMail(resetMail(candidate.email, token));
      } else {
        req.flash("error", "User with such email is not exist");
      }
    });
  } catch (e) {
    throw e;
  }
});

router.get("/reset/password/:token", async (req, res) => {
  if (!req.params.token) {
    return res.redirect("/auth/reset");
  }

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() }
    });

    if (!user) {
      req.flash("error", "срок ссылки вышел");
      res.redirect("auth/reset");
    } else {
      res.render("set-password", {
        title: "Set password",
        token: user.resetToken
      });
    }
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

router.post("/reset/password", async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() }
    });
    if (!user) {
      req.flash("error", "время ссылки истекло");
      res.redirect("/");
    } else {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = null;
      user.resetTokenExp = null;
      await user.save();
      res.redirect("/auth");
    }
  } catch (e) {
    throw e;
    res.redirect("/");
  }
});

module.exports = router;
