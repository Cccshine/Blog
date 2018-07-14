const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const nodemailer = require('nodemailer');
const config = require('config-lite')(__dirname);
const router = express.Router();
const UserModel = mongoose.model('User');
const VerifyCodeModel = mongoose.model('VerifyCode');
const transporter = nodemailer.createTransport(config.smtpConfig);

router.post('/', function(req, res) {
  let username = req.body.username;
  UserModel.findOne({"name":username}).then((user) => {
    if(user){
        return res.json({"status":1,"email":user.email, "msg":"verify success"});//验证确实存在
    }else{
      return res.json({"status":0,"msg":"user unexsist"});//用户不存在
    }
  }).catch((err) => {
    //console.log(err);
    res.status(500).send('Something broke!');
  })
});

router.get('/', function(req, res) {
  let {username,toEmail} = req.query;
  let verifyCode = Math.round( Math.random()*(999999 - 100000) + 100000);
  let html = `<div style="border: 1px solid #22C3AA;border-radius: 10px;padding: 10px;font-size: 16px;overflow: hidden;">
            <p style="font-weight: bold;">亲爱的用户：</p>
            <p style="text-indent: 2em;">您好！感谢您支持Cshine小栈，您正在进行邮箱验证，本次验证的验证码为：</p>
            <p style="text-indent: 2em;"><strong style="color: #D0648A;">${verifyCode}</strong><span style="font-size: 12px;color: #bbb">(为了保障您帐号的安全性，验证码的有效期为30分钟。)</span></p>
            <div style="float: right;">
              <p>Chsine小栈</p>
              <p>${moment().format('YYYY-MM-DD')}</p>
            </div>
          </div>`;
  let option = {
      from:config.smtpConfig.auth.user,
      to:toEmail,
      subject : 'Cshine--登录保护验证',
      html : html
  }
  transporter.sendMail(option, function(error, response){
    if(error){
        //console.log("fail: " + error);
        return res.json({"status":0,"msg":"send failed"});//发送失败
    }else{
        //console.log("success: " + response.messageID);
        VerifyCodeModel.findOneAndUpdate({username: username}, {$set:{verifyCode:verifyCode}}, {upsert: true,new: true,setDefaultsOnInsert:true}).then((verify) => {
          verify.meta.updateAt = Date.now();
          verify.save((err) => {
            //console.log(err);
          })
          return res.json({"status":1,"msg":"send success"});//发送成功
        }).catch((err) => {
          //console.log(err);
          res.status(500).send('Something broke!');
        });
    }
  });
});

router.post('/verify', function(req, res) {
  let {username,verifyCode} = req.body;
  VerifyCodeModel.findOne({"username":username}).then((verify) => {
    if(verify){
        if(verifyCode === verify.verifyCode){
          return res.json({"status":2,"msg":"verify success"});//验证成功
        }else{
          return res.json({"status":1,"msg":"verify failed"});//验证码错误
        }
    }else{
      return res.json({"status":0,"msg":"verify expires"});//验证码过期
    }
  }).catch((err) => {
    //console.log(err);
    res.status(500).send('Something broke!');
  })
});

module.exports = router;