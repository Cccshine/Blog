const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    articleId: mongoose.Schema.Types.ObjectId,
    activityMode:Number,//1--收藏文章 2--点赞文章  3--取消文章收藏 4--取消文章点赞 5--评论了文章
    createTime:{
        type:Date,
        default:Date.now()
    }
});

//保存前执行的函数
ActivitySchema.pre('save',function(next){
	this.createTime = Date.now();
	next();
})

module.exports = ActivitySchema;