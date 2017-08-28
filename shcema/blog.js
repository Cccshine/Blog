var config = require('config-lite')(__dirname);
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

export.User = mongolass.model('User',{
	name:{type:'string'},
	password:{type:'string'},
});
//根据用户名找到用户，用户名唯一
exports.User.index({name:1},{unique:true}).exec();