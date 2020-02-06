const express = require("express");
const exphbs = require("express-handlebars");
const addRoute = require("./routes/add");
const coursesRoute = require("./routes/courses");
const mainRoute = require("./routes/main");
const app = express();

//зарегистрировать шаблонизатор
const hbs = exphbs.create({
  defaultLayout: "main", //default layout
  extname: "hbs" // file extension
});

app.engine("hbs", hbs.engine); // регистрируем движок шаблона
app.set("view engine", "hbs"); // указываем что расширение файла hbs
app.set("views", "views"); // layout path

app.use(express.static("./public"));

app.use(express.urlencoded({ extended: false }));

app.use("/", mainRoute);
app.use("/courses", coursesRoute);
app.use("/add", addRoute);

app.get("/", (req, res) => {});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
