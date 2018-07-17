const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const router = express.Router();
const UserModel = mongoose.model('User');
const fs = require('fs');
const images = require("images");
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, 'dist/uploads');//部署服务器用这个
    cb(null, 'public/uploads');//本地用这个
  },
  filename: (req, file, cb) => {
    let type = file.originalname.split(".");
    let name = req.session.username;
    cb(null, `${file.fieldname}-${name}-${Date.now()}.${type[type.length - 1]}`);
  }
})
const upload = multer({ storage: storage }).single('avatar');

router.post('/reset-password', function(req, res) {
  let {username,password} = req.body;
  UserModel.findOneAndUpdate({name:username},{$set:{password:password}}).then((user) => {
      return res.json({"status":1,"msg":"reset success"});//密码修改成功
  }).catch((err) =>{
    //console.log(err);
    res.status(500).send('Something broke!');
  });
});


router.post('/edit-email', function(req, res) {
  let {username,email} = req.body;
  UserModel.findOneAndUpdate({name:username},{$set:{email:email}}).then((user) => {
      return res.json({"status":1,"msg":"edit success"});//邮箱修改成功
  }).catch((err) =>{
    //console.log(err);
    res.status(500).send('Something broke!');
  });
});

router.get('/', function(req, res) {
  let username = req.query.username;
  UserModel.findOne({name:username},{name:1,email:1,avatar:1,role:1,_id:1}).then((user) => {
      return res.json({"status":1,"userInfo":user,"msg":"get success"});
  }).catch((err) =>{
    //console.log(err);
    res.status(500).send('Something broke!');
  });
});

router.post('/upload-avatar', function (req, res) {
  upload(req,res,(err)=>{
    if(err){
      //console.log(err);
      return res.status(500).send('Something broke upload!');
    }
    // req.file 是 `avatar` 文件的信息,req.body 将具有文本域数据，如果存在的话
    let avatarArea = JSON.parse(req.body.avatarArea);
    let newPath = `${req.file.destination}/clip-${req.file.filename}`;
    let frontPath = `/uploads/clip-${req.file.filename}`;
    //console.log(avatarArea)
    //截取生成新图片
    images(images(req.file.path),avatarArea.x1,avatarArea.y1,avatarArea.width,avatarArea.height).resize(200).save(newPath);
    //删除用户上传的图片
    fs.unlink(req.file.path,(err)=>{
      if(err){
        //console.log(err);
        return res.status(500).send('Something broke!');
      }
      //console.log('删除用户上传的图片成功');
      UserModel.findOneAndUpdate({name:req.session.username},{$set:{avatar:frontPath}}).then((user) => {
          //user默认为更新前的集合，所以可以直接删掉上一次的头像
          // fs.unlink('dist'+user.avatar,(err)=>{//部署服务器用这个
          fs.unlink('public'+user.avatar,(err)=>{//本地用这个
            if(err){
              //console.log(err);
              return;
            }
            //console.log('删除原来的头像成功');
          })
          req.session.avatar = frontPath;
          req.session.foobar = Date.now();//加上这一句才能使req.session.cookie.maxAge生效,使数据库中的session更新
          return res.json({"avatarSrc":frontPath,"msg":"setting avatar success"});//头像修改成功
      }).catch((err) =>{
        //console.log(err);
        res.status(500).send('Something broke!');
      });
    })
  })
})

module.exports = router;
