const { Router } = require("express");
const auth = require("../middleware/auth");
const router = new Router();

router.get("/", auth, (req, res) => {
  const { user } = req.session;
  res.render("profile", {
    title: "profile",
    user
  });
});

module.exports = router;
