const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
	username: String,
	articleId: mongoose.Schema.Types.ObjectId,
	formUid:mongoose.Schema.Types.ObjectId,
	content:String,
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
CommentSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
})

module.exports = CommentSchema;