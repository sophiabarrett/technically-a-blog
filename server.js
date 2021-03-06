const express = require("express");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const path = require("path");
const helpers = require("./utils/helpers");

const app = express();
const PORT = process.env.PORT || 3001;

// sessions
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sess = {
  secret: "8[U}K#U*&+.&g8-KA%6ykP6o/D{1W*3bxMF72B-m|DE4l$,9M ,3WG347%]",
  cookie: {},
  resave: false,
  saveUninitalized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};
app.use(session(sess));

// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// handlebars
const exphbs = require("express-handlebars");
const hbs = exphbs.create({ helpers });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// set routes
app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 App now listening at port ${PORT} 🚀`)
  );
});
