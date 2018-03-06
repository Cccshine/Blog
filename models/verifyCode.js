const mongoose = require('mongoose');
const VerifyCodeSchema = require('../shcemas/verifyCode');

const VerifyCode = mongoose.model('VerifyCode',VerifyCodeSchema);

module.exports = VerifyCode;