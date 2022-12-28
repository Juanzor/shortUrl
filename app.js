var express = require("express");
var path = require("path");
const passport = require("passport");
const csrfToken = require("csurf");
const methodOverride = require("method-override");
var cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
var logger = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const User = require("./models/User");
const clientDB = require("./database/db");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");

var app = express();

const corsOptions = {
    credentials: true,
    origin: process.env.PATHEROKU || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.set("trust proxy", 1);
app.use(
    session({
        secret: process.env.SECRETSESSION,
        resave: false,
        saveUninitialized: false,
        name: "session-user",
        store: MongoStore.create({ clientPromise: clientDB, dbName: process.env.DB_NAME }),
            

        cookie: { secure: process.env.MODO == "production", maxAge: 30 * 24 * 60 * 60 * 1000 }, // no funca en desarollo!!
    })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => done(null, { id: user._id, userName: user.userName }));

passport.deserializeUser(async (user, done) => {
    const userDB = await User.findById(user.id);

    return done(null, { id: userDB._id, userName: userDB.userName });
});
app.use(logger("dev"));
app.use(methodOverride("_method"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(csrfToken({ cookie: true }));
app.use((req, res, next) => {
    let token = req.csrfToken();
    res.locals.csrfToken = token;
    return next();
});
app.use(mongoSanitize());

app.use("/", indexRouter);
app.use("/user", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
