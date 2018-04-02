const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const multer  = require('multer');
const router = express.Router();
const UserModel = mongoose.model('User');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/uploads')
  },
  filename: (req, file, cb) => {
    let type = file.mimetype.split('/')[1];
    let name = req.session.username;
    cb(null, `${file.fieldname}-${name}-${Date.now()}.${type}`);
  }
})
const upload = multer({ storage: storage })

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
  UserModel.findOne({name:username},{name:1,email:1,avatar:1,role:1,_id:0}).then((user) => {
      return res.json({"status":1,"userInfo":user,"msg":"get success"});
  }).catch((err) =>{
    console.log(err);
    res.status(500).send('Something broke!');
  });
});

router.post('/upload-avatar', upload.single('avatar'), function (req, res, next) {
  // req.file 是 `avatar` 文件的信息
  // req.body 将具有文本域数据，如果存在的话
  console.log(req.file)
})

module.exports = router;

//https://www.cnblogs.com/athean/p/6800895.html
//https://blog.csdn.net/cjd6568358/article/details/54346383