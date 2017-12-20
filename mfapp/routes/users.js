const express = require('express');
const router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const userModel = require('../models/userModel');
const config = require('../config/database');

router.post('/register',function(req,res,next){
	
	let newUser = new userModel({
		name: req.body.name,
		email:  req.body.email,
		username:  req.body.username,
		password: req.body.password
	});
	
	userModel.addUser(newUser,function(err,callback){
		if(err)
		{	
			if(err.code===11000){
			res.status(200).json(
					{
						success:false,
						name: err.name,
						msg:"This email is already registered. Please login"
					});
			}else{
				res.status(200).json(
						{
							success:false,
							name: err.name,
							msg:err.message
						});
			}
		
		}else
		
		{
			res.status(200).json(
					{
						success:true,
						msg:"User Registered"
					});
		}
	});
	
});

router.post('/authenticate',function(req,res,next){
	
	if(mongoose.connection.readyState===0){
		res.status(200).json(
				{
					success:false,
					msg:"Unable to connect to database. Please contact Admins"
				});
	}
	else
	{
	var username = req.body.username;
	var password = req.body.password;
	
	userModel.getUserByUsername(username,function(err,user){
		debugger;
		if(err) throw err;
		if(!user){
			res.status(200).json(
					{
						success:false,
						msg:"User not found. Please check credentials"
					});
		}
		else{
			userModel.comparePassword(password,user.password,function(err,isMatch){
				if(err) throw err;
				if(isMatch){
					
				var options = { expiresIn:604800 };
					const token = jwt.sign({user: user.username}, config.secret,options);
					
					res.status(200).json(
							{
								success:true,
								token:"JWT "+token,
								user:{
								id: user._id,
								name:user.name,
								username:user.username,
								email:user.email
								}
							});
				}
				else
					{
					res.status(200).json(
							{
								success:false,
								msg:"Incorrect password, please check again"
							});
						
					}
			});				//Compare password close
		}
	});						//getUserByUsername close
	
		}					// mongoose connection check else close	
});

router.get('/profile',function(req,res,next){
	res.send('profile');
});

parseError = function(err){
	if(err.code===11000){
		
	}
}



module.exports = router;