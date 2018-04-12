module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if (!req.session.username) {
      return res.json({"isLogin":false});
    }else{
      res.json({"isLogin":true,"uid":req.session.uid,"username":req.session.username,"avatar":req.session.avatar,"role":req.session.role});
    }
    next();
  }
};