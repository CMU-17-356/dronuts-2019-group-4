const express = require('express')
const path = require('path')
const app = express()


const mongoUtil = require(path.join(__dirname,'mongoUtil'))
const apiRouter = require(path.join(__dirname,'routes/api'))

const port = 80
var TIC // test info collection
const TICname = "testInfo"
var counter = 0
var database

const CLIENT_BUILD_PATH = path.join(__dirname, '../client/build');
app.use(express.static(CLIENT_BUILD_PATH))
app.use(express.json())

app.get('*', function(request, response) {
  response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.get('/message', (req, res) => {
	console.log("hit the message API")
	res.json({
		message: "If you're seeing this, the Express API is working"
	})
})

app.use('/api',apiRouter)

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "849846779398-lv5g3r773e8pkss1vp02t08vgrhn0g9d.apps.googleusercontent.com",
    clientSecret: "mbvJWMDqVjcY-B_0vCUnG2Ck",
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      var user = {
        email: profile.emails[0].value,
        name: profile.displayName,
        token: accessToken
    };
      cb(null, user);
  }));


// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  /*User.findById(id, function(err, user) {
            cb(err, user);
        });*/
    cb(null, user);
});



app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', "email"] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: "/", session:false }),
  function(req, res) {
    var token = req.user.token;
    res.redirect('http://localhost:3000?token='+token);
  });


mongoUtil.startMongo().then(() => {
	database = mongoUtil.getDatabase()
	app.listen(port, () => console.log("listening"))
})




