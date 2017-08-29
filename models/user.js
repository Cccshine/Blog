const mongoose = require('mongoose');
const UserSchema = require('../shcemas/user');

//使用schema编译生成model
const User = mongoose.model('User',UserSchema);

module.exports = User;
