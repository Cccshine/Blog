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
	}
});
module.exports = UserSchema;