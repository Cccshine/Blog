const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
	name: String,
	articles: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Article'
	}],
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
TagSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
})

//静态方法
TagSchema.statics = {
	fetch: (callback) => {
		this.find({}).exec(callback)
	}
};

module.exports = TagSchema;