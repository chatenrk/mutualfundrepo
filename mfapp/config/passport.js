var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const userModel = require('../models/userModel');
const config = require('../config/database');



module.exports = function(passport)
{
	var opts = {}
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = config.secret;
		
		passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		    userModel.getUserById(jwt_payload._id,function(err, user){
		    	  if (err) {
		              return done(err, false);
		          }
		          if (user) {
		              return done(null, user);
		          } else {
		              return done(null, false);
		              
		          }
		    });
		}));

}