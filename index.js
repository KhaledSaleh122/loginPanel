////////ES6 __dirname + __filename///////////
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
////////////////////
import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();
import session from 'express-session'
import passport from 'passport'
//import passportLocal from 'passport-local';
import passportLocalMongoose from 'passport-local-mongoose';
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_LINK, function (err) {
    if (err) {
        console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
    }
}
);


////////////////
const app = express();
app.set('view-engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());
/////////////////
const port = 3000;
////////////////
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("account", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
///////////////
app.listen(port, () => {
    console.log("server start at port " + port);
});

app.route("/").get((req, res) => {
    if(req.isAuthenticated()){
        res.redirect('/home');
    }else{
        res.render("login.ejs");
    }
}).post((req, res) => {
    const isValid = validateInfo_login(req.body)
    if (isValid) {
        const user = new User(
            {
                username: req.body.name,
                password: req.body.password
            });
        req.login(user,function(err){
            if(err){
                res.send([{ err: "Username or password is wrong" }]);
            }else{
                const authenticate = User.authenticate();
                authenticate(req.body.name, req.body.password, function (err, result) {
                    if (err) {
                        res.send([{ err: "Error while loggin into your account, try later" }]);
                    } else {
                        if (result) {
                            res.send([{ err: "" }]);
                        } else {
                            res.send([{ err: "Username or password is wrong" }]);
                        }
                    }
                });
            }
        })

    } else {
        res.send([{ err: "Error while logging into your account, try later _" }]);
    }
});

function validateInfo_login(info) {
    if (info.name && info.password) {
        return true;
    } else {
        return false;
    }
}

app.route('/logout').get((req,res)=>{
    req.logOut(function(err) {
        if (err) { console.log(err); return next(err); }
        res.redirect('/');
    });
})


app.route('/home').get((req, res) => {
    if (req.isAuthenticated()) {
        res.send("farooq gay is auth");
    } else {
        res.send('farooq gay is not auth');
    }
})

app.route('/register').get((req, res) => {
    if(req.isAuthenticated()){
        res.redirect('/home');
    }else{
        res.render("register.ejs");
    }
}).post((req, res) => {
    const isValid = validateInfo(req.body);
    if (!isValid) {
        res.send([{ err: "Error while registering your account, try later" }]);
    } else {
        User.find({ $or: [{ username: req.body.name }, { email: req.body.email }] }, function (err, docs) {
            if (err) {
                console.log(err);
                res.send([{ err: "Error while registering your account, try later" }]);
            } else {
                if (docs.length == 0) {
                    addUserToDB(req.body, res, req);
                } else {
                    res.send([{ err: "Username or email already in use" }]);
                }
            }
        })

    }
});


function addUserToDB(data, res, req) {
    User.register({ username: data.name, email: data.email }, data.password, (err, user) => {
        if (err) {
            console.log(err)
            res.send([{ err: "Error while registering your account, try later" }]);
        } else {
            const authenticate = User.authenticate();
            req.login(user,function(err){
                if(err){
                    res.send([{ err: "Your account is registerd, but error while logging in",pass : true }]);
                }else{
                    const authenticate = User.authenticate();
                    authenticate(data.name,data.password, function (err, result) {
                        if (err) {
                            res.send([{ err: "Your account is registerd, but error while logging in",pass : true }]);
                        } else {
                            if (result) {
                                res.send([{ err: "" }]);
                            } else {
                                res.send([{ err: "Your account is registerd, but error while logging in",pass : true }]);
                            }
                        }
                    });
                }
            })
            //passport.authenticate('local')(req,res,function(){
            //console.log("xzczxczxczx");
            // })
        }
    })
}

function validateInfo(info) {
    var isValidate = true;
    if (info.name && info.password && info.email && info.confirm_password) {
        const hasNonAlphaNumericChars = /[^A-Za-z0-9]/g.test(info.name);
        const isValid = /^[A-Za-z]+[0-9]*[A-Za-z0-9]*$/.test(info.name);
        const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(info.email)
        if (!isEmailValid) {
            isValidate = false;
        }
        if (!isValid || hasNonAlphaNumericChars) {
            isValidate = false;
        }
        if (info.password.length >= 6 || info.confirm_password.length >= 6) {
            if (info.password !== info.confirm_password) {
                isValidate = false;
            }
        } else {
            isValidate = false;
        }
    } else {
        isValidate = false;
    }
    return isValidate;
}
