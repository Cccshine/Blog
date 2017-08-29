const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const UserModel = mongoose.model('User');


router.post('/', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let _user = {
  	name:username,
  	password:password
  }
  UserModel.findOne({name:username},function(err,user){
  	if(err){
  		console.log(err);
  		res.status(500).send('Something broke!');
  	}
  	if(user){
  		//用户名已存在
  		return res.json({status:0});
  	}else{
  		//由model生成entity
  		user = new UserModel(_user);
  		//基于entity进行save保存
  		user.save(function(err,user){
  			if(err){
  				console.log(err)
  			}
  			// 将当前登录用户名保存到session中
  			// req.session.user = user;
  			return res.json({status:1});
  		})
  	}
  })

});

module.exports = router;