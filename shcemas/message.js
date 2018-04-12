const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    operateUser: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receiveUser: mongoose.Schema.Types.ObjectId,
    article:{
    	type:mongoose.Schema.Types.ObjectId,
    	ref:'Article'
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    },
    operateMode:Number,//1--收藏文章 2--点赞文章 3--评论了文章 4--点赞了评论 5--回复了评论 
    isRead:{
        type:Boolean,
        default:false
    },
    createTime:{
        type:Date,
        default:Date.now()
    }
});

//保存前执行的函数
MessageSchema.pre('save',function(next){
	this.createTime = Date.now();
	next();
})

module.exports = MessageSchema;