// config/passport.js

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User       = require('../app/models/user');
var Download	= require('../app/models/download');

// load the auth variables
var configAuth = require('./auth');
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

	// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'uname' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));



	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'uname' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.uname    = email;
                newUser.hearts    = [];
                newUser.diamond    = [];
                newUser.clubs    = [];
                newUser.no_of_cards    = 0;
                newUser.spades   = [];
                newUser.password = newUser.generateHash(password);
				

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));



	// =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
		profileFields: ['id','name', 'email', 'photos'],
		session:false,
		enableProof: true

    },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {
				//console.log("22222222222222");
				if(typeof profile.emails !== 'undefined' && profile.emails !='null' )
				{
					//console.log("11111");
                // find the user in the database based on their facebook id
                User.findOne({ 'uname' : profile.emails[0].value }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
						//console.log("1");
						//user.facebook.id    = profile.id;
						user.facebook.token = token;
						user.facebook.refreshtoken = refreshToken;
						user.save(function (err) {
						if (err) {
						  console.log(err);
						} else {
						  console.log('Updated', user);
						}
						});
                        return done(null, user); // user found, return that user
                    } else {
						//console.log("2");
                        // if there is no user found with that facebook id, create them
                        var newUser            = new User();
						//console.log('OK');
						console.log(profile);
						//console.log('OK2');
                        // set all of the facebook information in our user model
                        //newUser.facebook.id    = profile.id; // set the users facebook id                   
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                        newUser.facebook.refreshtoken = refreshToken; // we will save the token that facebook provides to the user                    
                        newUser.name  = profile.name.givenName + ' ' + profile.name.familyName || profile.name ; // look at the passport user profile to see how names are returned
                        //newUser.facebook.name  = profile.displayName;
						newUser.hearts    = [];
						newUser.diamond    = [];
						newUser.clubs    = [];
						newUser.spades   = [];
						newUser.no_of_cards   = 0;
						newUser.uname = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
						newUser.dp='./downloads'+newUser.uname+'.png';
						uri	   = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
						Download(newUser.uname,uri,function(err){
						if(err){
							console.log('error in downloading picture');
							throw(err);
						}
						else
							console.log('Profile Picture downloaded');
						});
						
                        // save our user to the database
						//console.log('link');
						//console.log(newUser.dp);
						//var uri="graph.facebook.com/"; + newUser.facebook.id + "/picture?width=200&height=200&access_token=" + newUser.facebook.token;
						
						//console.log(profile.link);
						
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
			}else {
				done("Unable to use facebook. Please try other method");

			}

            }

        });

    }));
};