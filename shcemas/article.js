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
	scan:Number,
	isPublic:{
		type:Boolean,
		default:false
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
		article.updateTime = Date.now();
	}
	next();
})

ArticleSchema.pre('update',function(next){
	let isPublic = this.getUpdate().$set.isPublic;
	if(isPublic){
		this.update({},{$set:{publicTime:Date.now()}});
	}else{
		this.update({},{$set:{updateTime:Date.now()}});
	}
	next();
})



module.exports = ArticleSchema;