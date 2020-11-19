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

const PORT = process.env.PORT || 4000;

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

app.post("/update", (req, res) => {
    var myquery = { _id: req.body.id };
    var newvalues = { $set: { favorites: req.body.favorites } };
    User.updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });
    (req, res);
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
    console.log("register req: ", req.body);

    try {
        User.findOne({ username: req.body.username }, async (err, doc) => {
            if (doc) res.send("User Already Exists");
            if (!doc) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const newUser = new User({
                    username: req.body.username,
                    password: hashedPassword,
                });
                try {
                    await newUser.save();
                    res.send(newUser._id);
                }
                catch(eror){
                    console.log("saving user in db failed",error);
                    res.send(error);
                }
            }
        });
    }
    catch (eror) {
        console.log("register returned error: ", eror);
        res.send(error);
    }

    // User.findOne({ username: req.body.username }, async (err, doc) => {
    //     if (err) {
    //         console.log("error at register find one: ",err);
    //         throw err;
    //     }
    //     if (doc) res.send("User Already Exists");
    //     if (!doc) {
    //         const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //         const newUser = new User({
    //             username: req.body.username,
    //             password: hashedPassword,
    //         });
    //         await newUser.save();
    //         res.send(newUser._id);
    //     }
    // });
});

//Start Server
app.listen(PORT, () => {
    console.log("Server Has Started On Port " + PORT);
});
