const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:String,
	//角色：0--普通用户 1--管理员
	role:{
		type:Number,
		default:0
	},
	email:String,
	meta:{
		createTime:{
			type:Date,
			default:Date.now()
		},
		updateTime:{
			type:Date,
			default:Date.now()
		}
	}
});

//保存前执行的函数
UserSchema.pre('save',function(next){
	let user = this;//this指之后要保存的user实例
	if(user.isNew){
		user.meta.createTime = user.meta.updateTime = Date.now();
	}else{
		user.meta.updateTime = Date.now();
	}
	next();
})

module.exports = UserSchema;