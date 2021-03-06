const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const UserModel = mongoose.model('User');


router.post('/', function(req, res) {
  let {username,password,email} = req.body;
  let _user = {
  	name:username,
  	password:password,
    email:email
  }
  if(username == 'admin'){
    _user.role = 1;
  }
  UserModel.findOne({name:username}).then((user) => {
  		if(user){
  			//用户名已存在
  			return res.json({"status":0,"msg":"user exsist"});//用户已存在
  		}else{
  			//由model生成entity
  			user = new UserModel(_user);
  			//基于entity进行save保存
  			user.save(function(err,user){
  				if(err){
						//console.log(err)
						return;
  				}
  				// 将当前登录用户名保存到session中
  				req.session.username = user.name;
  				return res.json({"status":1,"msg":"register success"});//注册成功
  			})
  		}
  	}).catch((err) =>{
  		//console.log(err);
  		res.status(500).send('Something broke!');
  	});
});

module.exports = router;