const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  //检查是否登录是根据req.session.username，所以退出时将username删除
  delete req.session.username;
  res.json({"msg":"logout success"});
});

module.exports = router;