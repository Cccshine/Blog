const mongoose = require('mongoose');

const VerifyCodeSchema = new mongoose.Schema({
	username: String,
    verifyCode:String,
    meta: {
    	createAt: {
    		type: Date,
    		default: Date.now()
    	},
    	updateAt: {
    		type: Date,
    		default: Date.now(),
    		index:{
    			expires: 1800
    		}
    	}
    }
});

//保存前执行的函数
VerifyCodeSchema.pre('save',function(next){
	let verify = this;//this指之后要保存的verify实例
	if(verify.isNew){
		verify.meta.createAt = verify.meta.updateAt = Date.now();
	}else{
		verify.meta.updateAt = Date.now();
	}
	next();
})

module.exports = VerifyCodeSchema;