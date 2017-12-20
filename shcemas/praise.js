// const mongoose = require('mongoose');

// const PraiseSchema = new mongoose.Schema({
// 	subjectId: mongoose.Schema.Types.ObjectId,//文章id或者评论id
// 	uid:mongoose.Schema.Types.ObjectId,//用户id
// 	type:{
// 		type:Number,
// 		default: 0//点赞类型 0--文章 1--评论
// 	},
// 	isPraise: {
// 		type:Boolean,
// 		default: false//是否点赞
// 	}
// 	meta: {
// 		createAt: {
// 			type: Date,
// 			default: Date.now()
// 		},
// 		updateAt: {
// 			type: Date,
// 			default: Date.now()
// 		}
// 	}
// });

// //保存前执行的函数
// PraiseSchema.pre('save', function(next) {
// 	if (this.isNew) {
// 		this.meta.createAt = this.meta.updateAt = Date.now();
// 	} else {
// 		this.meta.updateAt = Date.now();
// 	}
// 	next();
// })

// module.exports = PraiseSchema;