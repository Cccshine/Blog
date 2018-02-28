const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
	//文章类型 0--原创 1--转载 2--翻译
	articleId: mongoose.Schema.Types.ObjectId,
	type:{
		type:Number,
		default:0
	},
	title:String,
	tag:String,
	content:String,
	summary:String,
	scan:{
		type:Number,
		default:0
	},
	isPublic:{
		type:Boolean,
		default:false
	},
	praiseUser:[mongoose.Schema.Types.ObjectId],
	collectionUser:[mongoose.Schema.Types.ObjectId],
	commentTotal:{
		type:Number,
		default:0
	},
	createTime:{
		type:Date,
		default:Date.now()
	},
	updateTime:{
		type:Date,
		default:Date.now()
	},
	publicTime:{
		type:Date,
		default:Date.now()
	}
});

//保存前执行的函数
ArticleSchema.pre('save',function(next){
	let article = this;//this指之后要保存的article实例
	if(article.isNew){
		article.createTime = article.updateTime = article.publicTime = Date.now();
	}else{
		if(article.isPublic && article.publicTime == article.createTime){
			article.publicTime = Date.now();
		}else{
			article.updateTime = Date.now();
		}
	}
	next();
})

module.exports = ArticleSchema;