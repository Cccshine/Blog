const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
	articleId: mongoose.Schema.Types.ObjectId,
	parentId:mongoose.Schema.Types.ObjectId,
	fromUid:mongoose.Schema.Types.ObjectId,
	toUid:mongoose.Schema.Types.ObjectId,
	fromUsername: String,
	toUsername: String,
	content:String,
	praiseUser:[mongoose.Schema.Types.ObjectId],
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