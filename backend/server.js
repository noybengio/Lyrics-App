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

require('dotenv').config({ path: '../.env' }); //config method reads the .env file and saves the vars 
const music = require('musicmatch')({ apikey: process.env.API_KEY });

const PORT = process.env.SERVER_PORT || 4000;
const User = require('./user');

//----------------------------------------- END OF IMPORTS---------------------------------------------------

//connect to local mongodb
mongoose.connect(process.env.LOCAL_MONGO_URL);
mongoose.connection.once('open', function () { //listen once to event open means once the connection is open
    console.log("connection has been made to mongodb");
}).on('error', function (error) { //always listen to error event
    console.log("connection error: ", error);
})

// Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cors({
        origin: process.env.HTTP + process.env.HOST + process.env.CLIENT_PORT, // <-- location of the react app were connecting to
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
    let myquery = { _id: req.body.id };
    let newvalues = { $set: { favorites: req.body.favorites } };
    console.log("starting update.....");
    try {
        User.updateOne(myquery, newvalues, function (err, res) {
            console.log("1 document updated");
        });
    }
    catch (error) {
        console.log("Error at update: ", error);
        res.json("Error at update: ", error);
    }
    (req, res);
});


app.post("/login", (req, res) => {
    console.log("login req: ", req.body);
    console.log("tryng to login.....");
    passport.authenticate("local", (err, user) => {
        if (err) {
            console.log("Error at passport.authenticate: ", err);
            res.json("Error at passport.authenticate: ", err);
            throw err;
        }
        if (!user) res.json("No User Exists");
        else {
            req.logIn(user, (err) => {
                if (err) {
                    console.log("Error at logIn: ", err);
                    res.send("Error at logIn: ", err);
                    throw err;
                }
                res.json(req.user);
            });
        }
    })
        (req, res);
});

app.post("/register", (req, res) => {
    console.log("register req: ", req.body);
    console.log("tryng to register.....");

    try {
        User.findOne({ username: req.body.username }, async (err, doc) => {
            if (doc) res.json("User Already Exists");
            if (!doc) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const newUser = new User({
                    username: req.body.username,
                    password: hashedPassword,
                });
                try {
                    await newUser.save();
                    res.json(newUser._id);
                }
                catch (error) {
                    console.log("saving user in db failed", error);
                    res.json(error);
                }
            }
        });
    }
    catch (error) {
        console.log("register returned error: ", error);
        res.json(error);
    }
});

app.get("/lyrics", (req, res) => {
    console.log("req: ", req.query);
    const songToDisplay = req.query;
    try {
        music.matcherLyrics({ q_track: songToDisplay.songTitle, q_artist: songToDisplay.artist })
            .then((data) => {
                const lyrics = data.message.body.lyrics.lyrics_body;
                console.log("lyrics",lyrics);
                if (lyrics === null) {
                    res.json(null);
                } else {
                    res.json(lyrics);
                }
            }).catch((err) => {
                console.log("error",err);
                res.json(err);
            })
    }
    catch (error) {
        console.log(error);
    }
    (req, res);
});

//Start Server
app.listen(PORT, () => {
    console.log("Server Has Started On Port " + PORT);
});
