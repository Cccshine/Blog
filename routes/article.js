const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ArticleModel = mongoose.model('Article');
const TagModel = mongoose.model('Tag');

router.post('/',function(req,res){
	let {todo,articleId,type,title,tag,content} = req.body;
	let matchArr = content.match(/(\.|\n)*<!-- more -->/);
	let sliceIndex = matchArr ? matchArr.index : 10;
	let summary = content.slice(0,sliceIndex) + '...';
	let tagArr = tag.split(';');
	tagArr.pop();
	let _article = {
		type:type,
		title:title,
		tag:tag,
		content:content,
		summary: summary
	}
	let newArticle = null;
	if(todo == 1){
		_article.isPublic = true;
	}else{
		_article.isPublic = false;
	}

	if(articleId){//非新建
		console.log('更新')
		ArticleModel.findOneAndUpdate({_id:articleId},{$set:_article}).then((article) => {
			return res.json({"status":1,article:article,"msg":"save success"});
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		});
	}else{//新建
		console.log('新建');
		newArticle = new ArticleModel(_article);
		newArticle.save().then((article) => {
			return res.json({"status":1,article:article,"msg":"add success"});
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		});
	}
	//存储标签分类
	for (let tagName of tagArr){
		TagModel.findOne({name:tagName}).then((tag) => {
			if(tag){
				let id = articleId || newArticle._id;
				let strArticles = tag.articles.map((value) => {
					return value.toString();
				})
				if(!strArticles.includes(id)){
					tag.articles.push(id);	
				}
				tag.save((err) => {
					console.log(err);
				})
			}else{
				let newTag = new TagModel({
					name:tagName,
					articles: [articleId || newArticle._id]
				});
				newTag.save((err) => {
					console.log(err);
				})
			}
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		});
	}
});

router.delete('/',function(req,res){
	let {articleId} = req.body;
	let tagArr = [];
	console.log('delete:'+articleId)
	ArticleModel.findOneAndRemove({_id:articleId}).then((article) => {
		tagArr = article.tag.split(';');
		tagArr.pop();
		for(let tagName of tagArr){
			console.log('tagName'+tagName)
			TagModel.findOne({name:tagName}).then((tag) => {
				tag.articles = tag.articles.filter((ele,index) => {
					return ele.toString() !== articleId;
				});
				tag.save((err) => {
					console.log(err);
				})
			}).catch((err) => {
				console.log(err);
				res.status(500).send('Something broke!');
			});
		}
		return res.json({"status":1,"msg":"delete success"});
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	});
	// ArticleModel.remove({_id:articleId}).then(() => {
	// 	return res.json({"status":1,"msg":"delete success"});
	// }).catch((err) => {
	// 	console.log(err);
	// 	res.status(500).send('Something broke!');
	// });
});

router.get('/',(req,res) => {
	let mode = req.query.mode;
	let tagName = req.query.tagName;
	if(mode == 'detail'){//文章详情页
		let articleId = req.query.articleId;
		ArticleModel.findOne({isPublic:true, _id:articleId}).then((article) => {
			console.log(article)
			return res.json({"status":1,article:article,"msg":"success"});
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		})
	}else if(mode == 'draft'){//草稿箱
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
	}else if(mode == 'public' && !tagName) {//首页文章列表
		ArticleModel.find({isPublic:true}).then((articleList) => {
			if(articleList.length > 0){
				return res.json({"status":1,"articleList":articleList,"msg":"get success"});
			}else{
				return res.json({"status":0,"articleList":articleList,"msg":"no article"});
			}
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		})
	}else if(mode == 'public' && tagName){//标签分类文章列表
		TagModel.find({name:tagName}).then((tag) => {
			console.log(tag)
		})
	
	}else{//编辑页
		let articleId = req.query.articleId;
		ArticleModel.findOne({_id:articleId}).then((article) => {
			console.log(article)
			return res.json({"status":1,article:article,"msg":"success"});
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		})
	}
})


module.exports = router;