const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ArticleModel = mongoose.model('Article');
const CommentModel = mongoose.model('Comment');

router.post('/',function(req,res){
	let {subjectId,type,uid} = req.body;
	if(type === 0){//对文章点赞
		ArticleModel.findOneAndUpdate({_id:subjectId},{$addToSet: {praiseUser: uid}}).then((praise) => {
			return res.json({"status":1,"msg":"praise success"});
		}).catch((err) => {
			//console.log(err);
			res.status(500).send('Something broke!');
		});
	}else{//对评论点赞
		CommentModel.findOneAndUpdate({_id:subjectId},{$addToSet: {praiseUser: uid}},{new:true}).then((comment) => {
			comment.praiseTotal = comment.praiseUser.length;
			comment.save();
			return res.json({"status":1,"msg":"praise success"});
		}).catch((err) => {
			//console.log(err);
			res.status(500).send('Something broke!');
		});
	}
});

router.delete('/',function(req,res){
	let {subjectId,type,uid} = req.body;
	if(type === 0){//对文章取消点赞
		ArticleModel.findOneAndUpdate({_id:subjectId},{$pull: {praiseUser: uid}}).then(() => {
			return res.json({"status":1,"msg":"cancle praise success"});
		}).catch((err) => {
			//console.log(err);
			res.status(500).send('Something broke!');
		});
	}else{//对评论取消点赞
		CommentModel.findOneAndUpdate({_id:subjectId},{$pull: {praiseUser: uid}},{new:true}).then((comment) => {
			comment.praiseTotal = comment.praiseUser.length;
			comment.save();
			return res.json({"status":1,"msg":"cancle praise success"});
		}).catch((err) => {
			//console.log(err);
			res.status(500).send('Something broke!');
		});
	}
});

module.exports = router;