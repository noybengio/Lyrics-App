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
require('dotenv').config(); //config method reads the .env file and saves the vars 
const { API_KEY, SERVER_PORT, LOCAL_MONGO_URL, CLIENT_PORT, PROTOCOL } = process.env;
const music = require('musicmatch')({ apikey: API_KEY });
const path = require('path');

const PORT = process.env.PORT || 4000;
const User = require('./user');

//----------------------------------------- END OF IMPORTS---------------------------------------------------

//connect to local mongodb
mongoose.connect(LOCAL_MONGO_URL);
mongoose.connection.once('open', function () { //listen once to event open means once the connection is open
    console.log("connection has been made to mongodb");
}).on('error', function (error) { //always listen to error event
    console.log("connection error: ", error);
})

// Middleware
const whitelist = ['http://localhost:3000', 'http://localhost:4000', 'https://bengio-lyrics-app.herokuapp.com/']
const corsOptions = {
    origin: function (origin, callback) {
        console.log("** Origin of request " + origin)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log("Origin acceptable")
            callback(null, true)
        } else {
            console.log("Origin rejected")
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(corsOptions));

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

//if (process.env.NODE_ENV === 'production') {
// Serve any static files
app.use(express.static(path.join(__dirname, '../client/build')));
// Handle React routing, return all requests to React app

//  }


// app.get('/', (req, res) => {
//     try {
//         res.sendFile(path.join(__dirname, '/build', 'index.html'));
//     } catch (error) {
//         console.log("Error at update: ", error);
//     }
// });

app.post("/update", (req, res) => {
    let myquery = { _id: req.body.id };
    let newvalues = { $set: { favorites: req.body.favorites } };
    console.log("starting update.....");
    console.log("update req: ", req.body);
    console.log("myquery: ", myquery);
    console.log("newvalues: ", newvalues);

    try {
        User.updateOne(myquery, newvalues, function (err, res) {
            console.log("document updated");
        });
        res.json("document updated");
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
        if (!user) {
            console.log("No User Exists");
            res.json("No User Exists");
        }
        else {
            console.log("before req.logIn ");
            req.logIn(user, (err) => {
                if (err) {
                    console.log("Error at logIn: ", err);
                    res.json({ "Error at logIn": err });
                    throw err;
                }
                else {
                    console.log("login successed");
                    res.json(req.user);
                }

            });
        }
    })
        (req, res); //cannot remove this line 
});

app.post("/register", (req, res) => {
    console.log("register req: ", req.body);
    console.log("tryng to register.....");

    try {
        User.findOne({ username: req.body.username }, async (err, doc) => {
            if (doc) {
                res.json("User Already Exists");
                console.log("User Already Exists");

            }
            if (!doc) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const newUser = new User({
                    username: req.body.username,
                    password: hashedPassword,
                });
                console.log("trying to save user in db");
                try {
                    await newUser.save();
                    //res.json(newUser._id);
                    console.log("user added to db!");
                    res.json({ success: true, data: newUser._id })
                }
                catch (error) {
                    console.log("saving user in db failed", error);
                    res.status(500).json({ success: false, data: error })
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
        //use musixmatch lyrics api to get lurics
        music.matcherLyrics({ q_track: songToDisplay.songTitle, q_artist: songToDisplay.artist })
            .then((data) => {
                const lyrics = data.message.body.lyrics;
                console.log("lyrics", lyrics);
                if (lyrics.lyrics_body === null) {
                    res.json(null);
                } else {
                    res.json(lyrics.lyrics_body);
                }
            }).catch((err) => {
                console.log("error", err);
                res.json(err);
            })
    }
    catch (error) {
        console.log(error);
    }
    (req, res);
});

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '../client/build/index.html'));
});

//Start Server
app.listen(PORT,"0.0.0.0", () => {
    console.log("Server Has Started On Port " + PORT);
});
