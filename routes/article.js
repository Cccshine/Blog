const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ArticleModel = mongoose.model('Article');

router.post('/',function(req,res){
	let {todo,articleId,type,title,tag,content} = req.body;
	let _article = {
		type:type,
		title:title,
		tag:tag,
		content:content,
	}
	if(todo == 1){
		_article.isPublic = true;
	}

	if(articleId){//非新建
		console.log('更新')
		ArticleModel.findOneAndUpdate({_id:articleId},{$set:_article}).then((article) => {
			console.log(article)
			return res.json({"status":1,article:article,"msg":"save success"});
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		});
	}else{//新建
		console.log('新建');
		ArticleModel.count({}).then((count) => {
			_article.order = count + 1;
			article = new ArticleModel(_article);
			article.save().then((article) => {
				return res.json({"status":1,article:article,"msg":"add success"});
			}).catch((err) => {
				console.log(err);
				res.status(500).send('Something broke!');
			});
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		});
	}
});

router.delete('/',function(req,res){
	let {articleId} = req.body;
	ArticleModel.remove({_id:articleId}).then(() => {
		return res.json({"status":1,"msg":"delete success"});
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
});

router.get('/',(req,res) => {
	let mode = req.query.mode;
	if(mode == 'public'){
		let order = Number(req.query.order);
		ArticleModel.findOne({order:order}).then((article) => {
			console.log(article)
			return res.json({"status":1,article:article,"msg":"success"});
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		})
	}else{

	}
})

router.get('/draft-list',(req,res) => {
	ArticleModel.find({isPublic:false}).then((draftList) => {
		if(draftList.length > 0){
			return res.json({"status":1,"draftList":draftList,"msg":"get success"});
		}else{
			return res.json({"status":0,"draftList":draftList,"msg":"no draft"});
		}
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
})


module.exports = router;