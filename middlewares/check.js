module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if (!req.session.username) {
      return res.json({"isLogin":false});
    }else{
      res.json({"isLogin":true,"username":req.session.username});
    }
    next();
  }
};