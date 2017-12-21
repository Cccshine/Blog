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
	this.praiseTotal = this.praiseUser.length;
	console.log('yyy')
	next();
})

CommentSchema.pre('update',function(next){
	let praiseUser = this.getUpdate().$set.praiseUser;
	this.update({},{$set:{praiseTotal:praiseUser.length}});
	console.log('update')
	next();
})


module.exports = CommentSchema;