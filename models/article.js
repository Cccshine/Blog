const mongoose = require('mongoose');
const common = require('../common.js');
const ArticleSchema = require('../shcemas/article');

const Article = mongoose.model('Article',ArticleSchema);
Article.pageFirst = function(res,query,pageSize){
	Article.find(query).then((articleList) => {//第一页时更新总数及总页数
		common.articleTotal = articleList.length;
		let pageTotal = Math.ceil(common.articleTotal/pageSize);
		console.log(0,pageTotal,common.articleTotal);
		console.log('pagefirst')
		// homePageTotal = Math.ceil(articleList.length/pageSize);
		// homeArticleTotal = articleList.length;
		Article.find(query).sort({publicTime:-1}).limit(pageSize).then((articleList) => {
			if(articleList.length > 0){
				return res.json({"status":1,"articleList":articleList,"pageTotal":pageTotal,"msg":"get success"});
			}else{
				return res.json({"status":0,"articleList":articleList,"pageTotal":pageTotal,"msg":"no article"});
			}
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		})
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
}
Article.pageLast = function(res,query,pageSize){
	let articleTotal = common.articleTotal;
	let pageTotal = Math.ceil(articleTotal/pageSize);
	let limit = articleTotal - (pageTotal - 1)*pageSize;
	console.log(pageTotal,articleTotal,limit);
	console.log('pagelast')
	Article.find(query).sort({publicTime:1}).limit(limit).then((articleList) => {
		if(articleList.length > 0){
			articleList.reverse();
			return res.json({"status":1,"articleList":articleList,"pageTotal":pageTotal,"msg":"get success"});
		}else{
			return res.json({"status":0,"articleList":articleList,"pageTotal":pageTotal,"msg":"no article"});
		}
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
}
Article.pagePrev = function(res,query,currentPage,pageSize){
	let skipNum = 0;
	let articleTotal = common.articleTotal;
	let pageTotal = Math.ceil(articleTotal/pageSize);
	console.log(currentPage,pageTotal,articleTotal);
	console.log('pageprev')
	if(currentPage === pageTotal - 2){
		skipNum = articleTotal - (currentPage+1)*pageSize - 1;
	}else{
		skipNum = pageSize - 1;
	}
	Article.find(query).sort({publicTime:1}).skip(skipNum).limit(pageSize).then((articleList) => {
		articleList.reverse();
		if(articleList.length > 0){
			return res.json({"status":1,"articleList":articleList,"pageTotal":pageTotal,"msg":"get success"});
		}else{
			return res.json({"status":0,"articleList":articleList,"pageTotal":pageTotal,"msg":"no article"});
		}
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
}
Article.pageNext = function(res,query,pageSize){
	let articleTotal = common.articleTotal;
	let pageTotal = Math.ceil(articleTotal/pageSize);
	console.log(currentPage,pageTotal,articleTotal);
	console.log('pagenext')
	Article.find(query).sort({publicTime:-1}).limit(pageSize).then((articleList) => {
		if(articleList.length > 0){
			return res.json({"status":1,"articleList":articleList,"pageTotal":pageTotal,"msg":"get success"});
		}else{
			return res.json({"status":0,"articleList":articleList,"pageTotal":pageTotal,"msg":"no article"});
		}
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
}

module.exports = Article;