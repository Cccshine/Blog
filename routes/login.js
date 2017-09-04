const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const router = express.Router();
const UserModel = mongoose.model('User');


router.post('/', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let _user = {
  	name:username,
  	password:password
  }
  UserModel.findOne({$or:[{"name":username},{"email": username}]})
  .then((user) => {
    if(user){
      if(password === user.password){
        req.session.username = user.name; 
        return res.json({"status":2,"msg":"login success"});//登录成功
      }else{
         return res.json({"status":1,"msg":"password failed"});//密码错误
      }
    }else{
      return res.json({"status":0,"msg":"user unexsist"});//用户不存在
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Something broke!');
  })
});

module.exports = router;