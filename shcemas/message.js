const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    operateUser: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receiveUser: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    article:{
    	type:mongoose.Schema.Types.ObjectId,
    	ref:'Article'
    },
    operateMode:Number,//1--收藏文章 2--点赞文章  3--取消文章收藏 4--取消文章点赞 5--评论了文章 6--回复了评论
    isRead:{
        type:Boolean,
        default:false
    }
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