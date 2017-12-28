const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		required:true,
		index:true
	},
	password: {
		type: String,
		required:true
	},
	email: {
		type: String,
		required:true
	},
	name: {
		type: String
	}
});

var userModel = module.exports = mongoose.model('User', UserSchema);


module.exports.getUserByUsername = function(username, callback){
	
	var query = {username: username};
	userModel.findOne(query, callback);
}

module.exports.getUserByEmail = function(email, callback){
	
	var query = {email: email};
	userModel.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	userModel.findById(id, callback);
}

module.exports.addUser = function(newUser,callback)
{
	
	
	bcrypt.genSalt(10, function(err, salt) 
			{
	    		bcrypt.hash(newUser.password, salt, function(err, hash) 
	    				{	
	    					if(err) {
	    						console.log(err);
	    						callback(err);
	    					}else{
	    						newUser.password = hash;
		    					newUser.save(callback);	
	    					}
	    					
	    				});
			});
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.checkdbConnection = function(callback){
	if(mongoose.connection.readyState===0){
		var err = {
				msg:"Error connecting to MongoDB. Please check with admin"
		}
		callback(err);
	}
	else
	{
		callback(null);
	}
}

