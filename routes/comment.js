const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ArticleModel = mongoose.model('Article');
const CommentModel = mongoose.model('Comment');

router.post('/',function(req,res){
	let {artcleId,parentId,fromUid,toUid,formUsername,toUsername,content} = req.body;
	let _comment = {
		artcleId:artcleId,
		parentId:parentId,
		fromUid:fromUid,
		toUid:toUid,
		formUsername:formUsername,
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

module.exports = router;