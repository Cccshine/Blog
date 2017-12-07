const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
	content:String,
	commentId: mongoose.Schema.Types.ObjectId,
	replyTragetId:mongoose.Schema.Types.ObjectId,
	replyType: Number,//0---评论的回复，1---回复的回复
	formUid:mongoose.Schema.Types.ObjectId,
	toUid:mongoose.Schema.Types.ObjectId,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

//保存前执行的函数
ReplySchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	this.total = this.articles.length;
	next();
})

//静态方法
ReplySchema.statics = {
	fetch: (callback) => {
		this.find({}).exec(callback)
	}
};

module.exports = ReplySchema;