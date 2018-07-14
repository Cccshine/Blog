const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ArticleModel = mongoose.model('Article');

router.get('/', function(req, res, next){
    if (!req.session.username) {
        return res.json({"isLogin":false});
    }else{
        return res.json({"isLogin":true,"uid":req.session.uid,"username":req.session.username,"avatar":req.session.avatar,"role":req.session.role});
    }
});

module.exports = router;