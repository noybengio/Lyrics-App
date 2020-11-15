const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

const User = require('./user');
//----------------------------------------- END OF IMPORTS---------------------------------------------------

mongoose.connect(
    "mongodb+srv://noyBengio:n7453573@cluster0.pk21n.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log("Mongoose Is Connected");
    }
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:3000", // <-- location of the react app were connecting to
        credentials: true,
    })
);
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);
//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

//Routes

app.post("/update", (req, res, next) => {
    var myquery = {_id:req.body.id };
    var newvalues = { $set: { favorites: req.body.favorites} };
    User.updateOne(myquery,newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
    (req, res, next);
});


app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) res.send("No User Exists");
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.send(req.user);
            });
        }
    })
        (req, res, next);
});

app.post("/register", (req, res) => {
    User.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.send("User Already Exists");
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
            });
            await newUser.save();
            res.send(newUser._id);
        }
    });
});


app.get("/user", (req, res) => {
    res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});

app.get("/favorites", (req, res) => {
    console.log("in server get favorites req: ", req.user);
    res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});


//Start Server
app.listen(4000, () => {
    console.log("Server Has Started");
});
