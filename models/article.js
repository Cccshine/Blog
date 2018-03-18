const mongoose = require('mongoose');
const ArticleSchema = require('../shcemas/article');

const Article = mongoose.model('Article',ArticleSchema);
Article.pageFirst = function(res,query,pageSize){
	Article.find(query).then((articleList) => {//第一页时更新总数及总页数
		homePageTotal = Math.ceil(articleList.length/pageSize);
		homeArticleTotal = articleList.length;
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
	Article.find(query).sort({publicTime:-1}).limit(pageSize).then((articleList) => {
		if(articleList.length > 0){
			return res.json({"status":1,"articleList":articleList,"pageTotal":homePageTotal,"msg":"get success"});
		}else{
			return res.json({"status":0,"articleList":articleList,"pageTotal":homePageTotal,"msg":"no article"});
		}
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
}
Article.pageLast = function(res,query,pageSize){
	let limit = homeArticleTotal - homePageTotal*pageSize;
	Article.find(query).sort({publicTime:1}).limit(limit).then((articleList) => {
		if(articleList.length > 0){
			return res.json({"status":1,"articleList":articleList,"pageTotal":homePageTotal,"msg":"get success"});
		}else{
			return res.json({"status":0,"articleList":articleList,"pageTotal":homePageTotal,"msg":"no article"});
		}
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
}
Article.pagePrev = function(res,query,currentPage,pageSize){
	let skipNum = 0;
	if(currentPage === homePageTotal - 2){
		skipNum = homeArticleTotal - (currentPage+1)*pageSize - 1;
	}else{
		skipNum = pageSize - 1;
	}
	Article.find(query).sort({publicTime:1}).skip(skipNum).limit(pageSize).then((articleList) => {
		articleList.reverse();
		if(articleList.length > 0){
			return res.json({"status":1,"articleList":articleList,"pageTotal":homePageTotal,"msg":"get success"});
		}else{
			return res.json({"status":0,"articleList":articleList,"pageTotal":homePageTotal,"msg":"no article"});
		}
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
}
Article.pageNext = function(res,query,pageSize){
	Article.find(query).sort({publicTime:-1}).limit(pageSize).then((articleList) => {
		if(articleList.length > 0){
			return res.json({"status":1,"articleList":articleList,"pageTotal":homePageTotal,"msg":"get success"});
		}else{
			return res.json({"status":0,"articleList":articleList,"pageTotal":homePageTotal,"msg":"no article"});
		}
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
}
module.exports = Article;