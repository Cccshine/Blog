const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const MessageeModel = mongoose.model('Message');

router.post('/',function(req,res){
    let {userId,articleId,operateMode} = req.body.commentId;
    let _message = {
		article:articleId,
		userId:userId,
		messageMode: messageMode
	}
	if(operateMode > 3){
		_message.comment = req.body.commentId
	}
	console.log('新增消息');
	let newMessage = new MessageeModel(_message);
	newMessage.save().then((message) => {
		return res.json({"status":1,"msg":"add message success"});
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	});
});


router.get('/',(req,res) => {
	MessageeModel.find({receiveUser:req.session.uid}).sort({createTime:-1}).populate('operateUser').populate('article').populate('comment').then((messageList) => {
		return res.json({"status":1,messageList:messageList,"msg":"success"});
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
})


module.exports = router;