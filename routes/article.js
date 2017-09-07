const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ArticleModel = mongoose.model('Article');

router.post('/',function(req,res){
	let {todo,articleId,type,title,tag,content} = res.body;
	let _article = {
		type:type,
		title:title,
		tag:tag,
		content:content
	}
	if(todo == 1){
		_article.isPublic = true;
	}

	ArticleModel.update({_id:articleId},{$set:_article},{upsert: true}).then((article) => {
		return res.json({"status":1,articleId:article._id,"msg":"add success"});
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})

	// if(articleId){//非新建
	// 	ArticleModel.update({_id:articleId},{$set:_article},{upsert: true}).then((article) => {
	// 		return res.json({"status":1,articleId:article._id,"msg":"add success"});
	// 	}).catch((err) => {
	// 		console.log(err);
	// 		res.status(500).send('Something broke!');
	// 	})
	// }else{//新建
	// 	article = new ArticleModel(_article);
	// 	article.save().then((article) => {
	// 		return res.json({"status":1,articleId:article._id,"msg":"add success"});
	// 	}).catch((err) => {
	// 		console.log(err);
	// 		res.status(500).send('Something broke!');
	// 	})
	// }


})

module.exports = router;