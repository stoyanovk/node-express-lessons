const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const addRoute = require("./routes/add");
const cardRoute = require("./routes/card");
const coursesRoute = require("./routes/courses");
const mainRoute = require("./routes/main");
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

app.use("/", mainRoute);
app.use("/courses", coursesRoute);
app.use("/add", addRoute);
app.use("/card", cardRoute);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url =
      "mongodb+srv://admin:F8a9LWCdYhOtIjUn@cluster0-y4oel.mongodb.net/shop";
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
start();
