var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
const MongoClient = require('mongodb').MongoClient;
const BodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectID;
const mongoose  = require('mongoose');
const { createServer } = require( 'http');
const port = process.env.PORT || 3000;
const compression = require('compression');
const path = require('path');
const Swal = require('sweetalert2');


// Create a new Express application.
var app = express();
app.use(compression());

/*
// Configure view engine to render EJS templates.
app.use(express.static(__dirname + '/views'));
//app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
*/

// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'views')));

// Set 'views' directory for any views
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));

// Set view engine as EJS
//app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

mongoose.connect ('mongodb+srv://Luke100:Luke100@clusterhurleyapp-ucfnz.mongodb.net/HurleyOrder?retryWrites=true&w=majority', {
  useNewUrlParser: true,
},
)

const Hurley = require('./models/Hurleys');

// Configure the local strategy for use by Passport.
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'mysession', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

//HOME
// Define routes.
app.get('/',
  function(req, res) {
    //res.render('404.ejs');
   res.render('home', { user: req.user });

  });

//Creat hurley Order
app.post('/insert',   require('connect-ensure-login').ensureLoggedIn(),
function(req, res, next) {

     let name = req.user.username;
     let style = req.body.hurleystyleDROP;
     let size = req.body.hurleysizeDROP;
     let weight = req.body.hurleyweightDROP;
     let quantity = req.body.hurleyquantityDROP;

          Hurley.create({
                  name: name,
                  hurleystyle: style,
                  hurleysize: size,
                  hurleyweight: weight,
                  hurleyquantity: quantity,
                })
                .then(user => res.send(user))
                .catch(err => res.send(err));
                res.redirect('/');
    });

//Home
app.post('/home.ejs',
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

//Logout
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

//Profile page
app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

//View orders
app.get('/vieworders', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
          Hurley.find({name: req.user.username},function(err, hurleys) {
          res.render('vieworders', { user: req.user, hurleys: hurleys});
        //  console.log(hurleys);
      });
});

//Handle anything other than whitelisted pages above
app.get('/*',
  function(req, res){
    res.render('404');
  });



app.listen(port);
