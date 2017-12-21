const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ArticleModel = mongoose.model('Article');
const CommentModel = mongoose.model('Comment');

router.post('/',function(req,res){
	let {articleId,parentId,fromUid,toUid,fromUsername,toUsername,content} = req.body;
	let _comment = {
		articleId:articleId,
		parentId:parentId,
		fromUid:fromUid,
		toUid:toUid,
		fromUsername:fromUsername,
		toUsername: toUsername,
		content: content
	}
	console.log('评论');
	let newComment = new CommentModel(_comment);
	newComment.save().then((comment) => {
		return res.json({"status":1,comment:comment,"msg":"comment success"});
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	});
})

router.get('/',function(req,res){
	let articleId = req.query.articleId;
	CommentModel.find({articleId:articleId,parentId:null}).sort({praiseTotal:1}).then((commentList) => {
		CommentModel.find({articleId:articleId,parentId:{$ne:null}}).then((replyList) => {
			return res.json({"status":1,commentList:commentList,replyList:replyList,"msg":"success"});
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		})
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
})

module.exports = router;