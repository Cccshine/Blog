const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const router = express.Router();
const MessageModel = mongoose.model('Message');
const common = require('../common.js');

let messagePageTotal = 0;
let messageByDayTotal = 0;

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
	//console.log('新增消息');
	let newMessage = new MessageModel(_message);
	newMessage.save().then((message) => {
		//console.log(operateUserId,receiveUserId,operateUserId != receiveUserId)
		if(operateUserId != receiveUserId){
			common.emitter.emit('messageChange',req);
		}
		return res.json({"status":1,"msg":"add message success"});
	}).catch((err) => {
		//console.log(err);
		res.status(500).send('Something broke!');
	});
});


router.get('/unread',(req,res) => {
	MessageModel.find({receiveUser:req.session.uid,isRead:false}).sort({createTime:-1}).populate('operateUser').populate('article').populate('comment').then((messageList) => {
		return res.json({"status":1,messageList:messageList,"msg":"success"});
	}).catch((err) => {
		//console.log(err);
		res.status(500).send('Something broke!');
	})
})

router.get('/',(req,res) => {
	let {lastTime,currentPage,pageSize,dir} = req.query;
	currentPage = Number(currentPage);
	pageSize = Number(pageSize);
	dir = Number(dir);
	
	let o = {};
	o.map = function () { 
		let date = this.createTime;
		let year = date.getUTCFullYear();
		let month = date.getUTCMonth() + 1;
		let day = date.getUTCDate();	
		let dayStr = year + "-" + (month < 10 ? '0' + month : month)  + "-" + (day < 10 ? '0' + day : day);
		emit(dayStr, this) 
	}
	o.reduce = function (k, vals) { return {infos:vals} }
	o.query = {receiveUser:req.session.uid}
	o.sort = {createTime:1}
	o.out = { replace: 'createdCollectionNameForResults' }

	if(currentPage === 0){//第一页
		MessageModel.mapReduce(o, function (err, model) {
			if(err){
				//console.log(err);
				res.status(500).send('Something broke!');
			}
			model.find().then((messageByDayList)=>{//第一页时更新总数及总页数
				messageByDayTotal = messageByDayList.length;
				messagePageTotal = Math.ceil(messageByDayTotal/pageSize);

				model.find().sort({_id:-1}).limit(pageSize).populate({path:'value.infos.operateUser value.operateUser',select:'name',model:'User'}).populate({path:'value.infos.article value.article',select:'title',model:'Article'}).populate({path:'value.infos.comment value.comment',select:'content',model:'Comment'}).exec(function (err, messageList) {
					if(err){
						//console.log(err);
						res.status(500).send('Something broke!');
					}
					
					if(messageList.length > 0){
						return res.json({"status":1,"messageList":messageList,"pageTotal":messagePageTotal,"msg":"get success"});
					}else{
						return res.json({"status":0,"messageList":messageList,"pageTotal":messagePageTotal,"msg":"no message"});
					}
			});
			}).catch((err) => {
				//console.log(err);
				res.status(500).send('Something broke!');
			})  
		})
	}else if(currentPage === messagePageTotal - 1){//最后一页
		let limit = messageByDayTotal - (messagePageTotal - 1)*pageSize;
		MessageModel.mapReduce(o, function (err, model) {
			if(err){
  				//console.log(err);
				res.status(500).send('Something broke!');
  			}
		    model.find().sort({_id:1}).limit(limit).populate({path:'value.infos.operateUser value.operateUser',select:'name',model:'User'}).populate({path:'value.infos.article value.article',select:'title',model:'Article'}).populate({path:'value.infos.comment value.comment',select:'content',model:'Comment'}).exec(function (err, messageList) {
	  			if(err){
	  				//console.log(err);
					res.status(500).send('Something broke!');
	  			}

	  			if(messageList.length > 0){
					messageList.reverse();
					return res.json({"status":1,"messageList":messageList,"pageTotal":messagePageTotal,"msg":"get success"});
				}else{
					return res.json({"status":0,"messageList":messageList,"pageTotal":messagePageTotal,"msg":"no message"});
				}
		  });
		})
	}else if(dir > 0){//下一页
		MessageModel.mapReduce(o, function (err, model) {
			if(err){
  				//console.log(err);
				res.status(500).send('Something broke!');
  			}
		    model.find({_id:{$lt:lastTime}}).sort({_id:-1}).limit(pageSize).populate({path:'value.infos.operateUser value.operateUser',select:'name',model:'User'}).populate({path:'value.infos.article value.article',select:'title',model:'Article'}).populate({path:'value.infos.comment value.comment',select:'content',model:'Comment'}).exec(function (err, messageList) {
	  			if(err){
	  				//console.log(err);
					res.status(500).send('Something broke!');
	  			}

	  			if(messageList.length > 0){
					return res.json({"status":1,"messageList":messageList,"pageTotal":messagePageTotal,"msg":"get success"});
				}else{
					return res.json({"status":0,"messageList":messageList,"pageTotal":messagePageTotal,"msg":"no message"});
				}
		    });
		})
	}else{//上一页
		let skipNum = 0;
		if(currentPage === messagePageTotal - 2){
			skipNum = messageByDayTotal - (currentPage+1)*pageSize - 1;
		}else{
			skipNum = pageSize - 1;
		}
		MessageModel.mapReduce(o, function (err, model) {
			if(err){
  				//console.log(err);
				res.status(500).send('Something broke!');
  			}
		    model.find({_id:{$gt:lastTime}}).sort({_id:1}).skip(skipNum).limit(pageSize).populate({path:'value.infos.operateUser value.operateUser',select:'name',model:'User'}).populate({path:'value.infos.article value.article',select:'title',model:'Article'}).populate({path:'value.infos.comment value.comment',select:'content',model:'Comment'}).exec(function (err, messageList) {
	  			if(err){
	  				//console.log(err);
					res.status(500).send('Something broke!');
	  			}
	  			messageList.reverse();
	  			if(messageList.length > 0){
					return res.json({"status":1,"messageList":messageList,"pageTotal":messagePageTotal,"msg":"get success"});
				}else{
					return res.json({"status":0,"messageList":messageList,"pageTotal":messagePageTotal,"msg":"no message"});
				}
		    });
		})
	}
	// MessageModel.find({receiveUser:req.session.uid}).sort({createTime:-1}).populate('operateUser').populate('article').populate('comment').then((messageList) => {
	// 	return res.json({"status":1,messageList:messageList,"msg":"success"});
	// }).catch((err) => {
	// 	//console.log(err);
	// 	res.status(500).send('Something broke!');
	// })
})

router.get('/setRead',(req,res) => {
	MessageModel.update({receiveUser:req.session.uid,isRead:false},{$set:{isRead:true}},{ multi: true }).then(() => {
		return res.json({"status":1,"msg":"success"});
	}).catch((err) => {
		//console.log(err);
		res.status(500).send('Something broke!');
	})
})

module.exports = router;