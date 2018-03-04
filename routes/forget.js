const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('config-lite')(__dirname);
const router = express.Router();
const UserModel = mongoose.model('User');


router.post('/', function(req, res, next) {
  let username = req.body.username;
  UserModel.findOne({$or:[{"name":username},{"email": username}]})
  .then((user) => {
    if(user){
        return res.json({"status":1,"msg":"login success"});//验证确实存在
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