// app/models/user.js
// load the things we need
//database schema
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
	uname        : String,
	name	     : String,
	password	 : String,
	dp			 : String,
	hearts		 : [String],
	clubs		 : [String],
	diamond		 : [String],
	spades		 : [String],
	no_of_cards	 : Number,

	facebook          : {
        id		 : String,
		token	 :String,
		refreshtoken: String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);