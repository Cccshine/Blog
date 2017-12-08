const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ArticleModel = mongoose.model('Article');
const CommentModel = mongoose.model('Comment');

router.post('/',function(req,res){
	let {artcleId,fromUid,toUid,formUsername,toUsername,content} = req.body;
})

module.exports = router;