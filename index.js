const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const User = require("./models/User");
const addRoute = require("./routes/add");
const cardRoute = require("./routes/card");
const coursesRoute = require("./routes/courses");
const mainRoute = require("./routes/main");
const orderRouter = require("./routes/order");
const authRouter = require("./routes/auth");
const path = require("path");
const app = express();

const hbs = exphbs.create({
  defaultLayout: "main", //default layout
  extname: "hbs" // file extension
});

app.engine("hbs", hbs.engine); // регистрируем движок шаблона
app.set("view engine", "hbs"); // указываем что расширение файла hbs
app.set("views", "views"); // layout path

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  try {
    const user = await User.findById({ _id: "5e5132347ea57f111c4241db" });
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use("/", mainRoute);
app.use("/courses", coursesRoute);
app.use("/add", addRoute);
app.use("/card", cardRoute);
app.use("/order", orderRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    const url =
      "mongodb+srv://admin:F8a9LWCdYhOtIjUn@cluster0-y4oel.mongodb.net/shop";
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        name: "Jon",
        email: "Jon@mail.ru",
        cart: {
          items: []
        }
      });
      user.save();
    }
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
start();
