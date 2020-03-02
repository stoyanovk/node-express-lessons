const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const addRoute = require("./routes/add");
const cardRoute = require("./routes/card");
const coursesRoute = require("./routes/courses");
const mainRoute = require("./routes/main");
const orderRouter = require("./routes/order");
const authRouter = require("./routes/auth");
const varMiddleware = require("./middleware/varMiddleware");
const userMiddleware = require("./middleware/user");
const path = require("path");
const session = require("express-session");
const csurf = require('csurf')
const flash = require('connect-flash');
const MongoDBStore = require("connect-mongodb-session")(session);

const url =
  "mongodb+srv://admin:F8a9LWCdYhOtIjUn@cluster0-y4oel.mongodb.net/shop";
const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs"
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

var store = new MongoDBStore({
  uri: url,
  collection: "mySessions"
}).on("error", function(error) {
  console.log(error);
});

app.use(
  session({
    secret: "lol kek",
    resave: false,
    saveUninitialized: true,
    store
  })
);
app.use(csurf())
app.use(flash())

app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", mainRoute);
app.use("/courses", coursesRoute);
app.use("/add", addRoute);
app.use("/card", cardRoute);
app.use("/order", orderRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3002;

async function start() {
  try {
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
