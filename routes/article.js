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
	if(_article.isPublic){
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
	}
});

router.delete('/',function(req,res){
	let {articleId} = req.body;
	let tagArr = [];
	ArticleModel.findOneAndRemove({_id:articleId}).then((article) => {
		tagArr = article.tag.split(';');
		tagArr.pop();
		for(let tagName of tagArr){
			TagModel.findOne({name:tagName}).then((tag) => {
				tag.articles = tag.articles.filter((ele,index) => {
					return ele.toString() !== articleId;
				});
				if(tag.articles.length > 0){
					tag.save((err) => {
						console.log(err);
					})
				}else{
					tag.remove((err) => {
						console.log(err)
					});
				}
				
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
});

router.get('/',(req,res) => {
	let {mode,lastTime,currentPage,pageSize,dir,articleId,tagName,startTime,endTime} = req.query;
	currentPage = Number(currentPage);
	pageSize = Number(pageSize);
	dir = Number(dir);
	if(mode == 'detail'){//文章详情页
		let result = {};
		ArticleModel.findOne({isPublic:true, _id:articleId}).then((article) => {
			article.scan++;
			article.save();
			result.article = article;
			return ArticleModel.find({isPublic:true, publicTime:{$lt:article.publicTime}}).sort({publicTime:-1}).limit(1).exec();
		}).then((lastArticle) => {
			result.lastArticle = lastArticle ? lastArticle[0] : null;
			console.log(result.article.publicTime)
			return ArticleModel.find({isPublic:true, publicTime:{$gt:result.article.publicTime}}).sort({publicTime:1}).limit(1).exec();
		}).then((nextArticle) => {
			result.nextArticle = nextArticle ? nextArticle[0] : null;
			return res.json({"status":1,result:result,"msg":"success"});
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		})
	}else if(mode == 'draft'){//草稿箱
		if(currentPage === 0){//第一页
			ArticleModel.pageFirst(res,{isPublic:false},pageSize);
		}else if(currentPage === homePageTotal - 1){//最后一页
			ArticleModel.pageLast(res,{isPublic:false},pageSize);
		}else if(dir > 0){//下一页
			ArticleModel.pageNext(res,{isPublic:false},pageSize);
		}else{//上一页
			ArticleModel.pagePrev(res,{isPublic:false},currentPage,pageSize);
		}
	}else if(mode == 'public' && !tagName) {//首页文章列表
		if(currentPage === 0){//第一页
			ArticleModel.pageFirst(res,{isPublic:true},pageSize);
		}else if(currentPage === homePageTotal - 1){//最后一页
			ArticleModel.pageLast(res,{isPublic:true},pageSize);
		}else if(dir > 0){//下一页
			ArticleModel.pageNext(res,{isPublic:true,publicTime:{$lt:lastTime}},pageSize);
		}else{//上一页
			ArticleModel.pagePrev(res,{isPublic:true,publicTime:{$gt:lastTime}},currentPage,pageSize);
		}
	}else if(mode == 'public' && tagName){//标签分类文章列表
		if(currentPage === 0){//第一页
			ArticleModel.pageFirst(res,{tag:eval("/"+tagName+"/i"), isPublic:true},pageSize);
		}else if(currentPage === homePageTotal - 1){//最后一页
			ArticleModel.pageLast(res,{tag:eval("/"+tagName+"/i"), isPublic:true},pageSize);
		}else if(dir > 0){//下一页
			ArticleModel.pageNext(res,{tag:eval("/"+tagName+"/i"), isPublic:true,publicTime:{$lt:lastTime}},pageSize);
		}else{//上一页
			ArticleModel.pagePrev(res,{tag:eval("/"+tagName+"/i"), isPublic:true,publicTime:{$gt:lastTime}},currentPage,pageSize);
		}
	}else if(mode == 'archive' && !startTime && !endTime){//归档页
		ArticleModel.aggregate([
			{
				$match:{
					"isPublic":true
				}
			},
			{
				$project:{
					yearMonth:{$dateToString:{ format: "%Y%m", date: "$publicTime" } },
				}
			},
			{
				$group:{
					_id:"$yearMonth",
					total:{
						$sum:1
					}
				}
			},
			{
				$sort:{
					_id:-1
				}
			}
		]).then((archiveList)=>{
			if(archiveList.length > 0){
				return res.json({"status":1,"archiveList":archiveList,"msg":"get success"});
			}else{
				return res.json({"status":0,"archiveList":archiveList,"msg":"no article"});
			}
		}).catch((err)=>{
			console.log(err);
		})
	}else if(mode == 'archive' && startTime && endTime){//归档文章列表
		if(currentPage === 0){//第一页
			ArticleModel.pageFirst(res,{isPublic:true,publicTime:{$gte:startTime,$lte:endTime}},pageSize);
		}else if(currentPage === homePageTotal - 1){//最后一页
			ArticleModel.pageLast(res,{isPublic:true,publicTime:{$gte:startTime,$lte:endTime}},pageSize);
		}else if(dir > 0){//下一页
			ArticleModel.pageNext(res,{isPublic:true,publicTime:{$lt:lastTime,$gte:startTime,$lte:endTime}},pageSize);
		}else{//上一页
			ArticleModel.pagePrev(res,{isPublic:true,publicTime:{$gt:lastTime,$gte:startTime,$lte:endTime}},currentPage,pageSize);
		}
	}else if(mode == 'edit'){//编辑页
		ArticleModel.findOne({_id:articleId}).then((article) => {
			return res.json({"status":1,article:article,"msg":"success"});
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		})
	}else{
		res.status(500).send('Something broke!');
	}
})


module.exports = router;