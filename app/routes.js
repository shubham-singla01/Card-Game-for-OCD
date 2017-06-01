// app/routes.js
var save_d=require("./models/save_data");
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.sendfile('views/index.html'); // load the index.ejs file
    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
			
        });
    });    
	app.get('/game', isLoggedIn, function(req, res) {
        res.render('game.ejs',{
			uname: req.user.uname
		});
    });
	app.get('/data', isLoggedIn, function(req, res) {
        res.send(JSON.stringify({
			hearts: req.user.hearts,
			clubs: req.user.clubs,
			spades: req.user.spades,
			diamond: req.user.diamond,
			cards: req.user.no_of_cards
		}));
    });
	
	// =====================================
    // SAVE DATA ===============================
    // =====================================
    // save user data
    app.post('/save_data', function(req, res) {
	save_d(req,res);
	});
	
	
	// =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
	
	// process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/game', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
	
	// process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/game', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
	
	
	// =====================================
    // FACEBOOK ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/game',
            failureRedirect : '/'
        }));
		
		

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}