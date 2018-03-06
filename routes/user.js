const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const router = express.Router();
const UserModel = mongoose.model('User');

router.post('/reset-password', function(req, res) {
  let {username,password} = req.body;
  UserModel.findOneAndUpdate({name:username},{$set:{password:password}}).then((user) => {
      return res.json({"status":1,"msg":"reset success"});//密码修改成功
  }).catch((err) =>{
    console.log(err);
    res.status(500).send('Something broke!');
  });
});


router.post('/edit-email', function(req, res) {
  let {username,email} = req.body;
  UserModel.findOneAndUpdate({name:username},{$set:{email:email}}).then((user) => {
      return res.json({"status":1,"msg":"edit success"});//邮箱修改成功
  }).catch((err) =>{
    console.log(err);
    res.status(500).send('Something broke!');
  });
});

router.get('/', function(req, res) {
  let {username} = req.query;
  UserModel.findOne({name:username},{name:1,email:1,role:1,_id:0}).then((user) => {
      return res.json({"status":1,"userInfo":user,"msg":"get success"});
  }).catch((err) =>{
    console.log(err);
    res.status(500).send('Something broke!');
  });
});

module.exports = router;