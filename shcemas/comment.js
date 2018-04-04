const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
	articleId: mongoose.Schema.Types.ObjectId,
	parentId:mongoose.Schema.Types.ObjectId,
	fromUser:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	},
	toUser:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	},
	content:String,
	praiseUser:[mongoose.Schema.Types.ObjectId],
	praiseTotal:{
		type:Number,
		default:0
	},
	createTime:{
		type:Date,
		default:Date.now()
	}
});

//保存前执行的函数
CommentSchema.pre('save', function(next) {
	if (this.isNew) {
		this.createTime = Date.now();
	}
	next();
})

module.exports = CommentSchema;