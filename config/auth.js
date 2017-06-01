// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
	
	'facebookAuth' : {
        'clientID'      : '1809214192633048', // your App ID
        'clientSecret'  : '99ebba53c65f9633f59d3f1c4c20d854', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

};
