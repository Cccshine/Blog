const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
	//文章类型 0--原创 1--转载 2--翻译
	type:{
		type:Number,
		default:0
	},
	title:String,
	tag:String,
	content:String,
	scan:Number,
	isPublic:{
		type:Boolean,
		default:false
	},
	meta:{
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
	}
});

//保存前执行的函数
ArticleSchema.pre('save',function(next){
	let article = this;//this指之后要保存的user实例
	if(article.isNew){
		article.meta.createTime = article.meta.updateTime = Date.now();
	}else{
		article.meta.updateTime = Date.now();
	}
	next();
})



module.exports = ArticleSchema;