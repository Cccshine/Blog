const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const MessageModel = mongoose.model('Message');
const common = require('../common.js');

router.post('/',function(req,res){
    let {articleId,messageMode,operateUserId,receiveUserId} = req.body;
    let _message = {
    	operateUser:operateUserId,
    	receiveUser:receiveUserId,
		article:articleId,
		messageMode: messageMode
	}
	if(messageMode > 2){
		_message.comment = req.body.commentId
	}
	console.log('新增消息');
	let newMessage = new MessageModel(_message);
	newMessage.save().then((message) => {
		console.log(operateUserId,receiveUserId,operateUserId != receiveUserId)
		if(operateUserId != receiveUserId){
			common.emitter.emit('messageChange');
		}
		return res.json({"status":1,"msg":"add message success"});
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	});
});


router.get('/unread',(req,res) => {
	MessageModel.find({receiveUser:req.session.uid,isRead:false}).sort({createTime:-1}).populate('operateUser').populate('article').populate('comment').then((messageList) => {
		return res.json({"status":1,messageList:messageList,"msg":"success"});
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
})

router.get('/all',(req,res) => {
	MessageModel.find({receiveUser:req.session.uid}).sort({createTime:-1}).populate('operateUser').populate('article').populate('comment').then((messageList) => {
		return res.json({"status":1,messageList:messageList,"msg":"success"});
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
})

router.get('/setRead',(req,res) => {
	let msgIds = req.query.msgIds.split(',');
	console.log(typeof msgIds,msgIds)
	MessageModel.update({_id:{$in:msgIds}},{$set:{isRead:true}}, {multi: true}).then(()=>{
		return res.json({"status":1,"msg":"read success"});
	}).catch((err)=>{
		console.log(err);
		res.status(500).send('Something broke!');
	})
})

module.exports = router;