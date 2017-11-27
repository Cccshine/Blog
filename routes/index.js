const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ArticleModel = mongoose.model('Article');
const checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin);

// router.get('/article-list', function(req,res){
// 	ArticleModel.find({isPublic:true}).then((articleList) => {
// 		if(articleList.length > 0){
// 			return res.json({"status":1,"articleList":articleList,"msg":"get success"});
// 		}else{
// 			return res.json({"status":0,"articleList":articleList,"msg":"no article"});
// 		}
// 	}).catch((err) => {
// 		console.log(err);
// 		res.status(500).send('Something broke!');
// 	})
// });

module.exports = router;