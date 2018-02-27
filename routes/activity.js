const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ActivityeModel = mongoose.model('Activity');

router.post('/',function(req,res){
    let {userId,articleId,activityMode} = req.body;
    let _activity = {
		articleId:articleId,
		userId:userId,
		activityMode: activityMode
	}
	console.log('新增动态');
	let newActivity = new ActivityeModel(_activity);
	newActivity.save().then((activity) => {
		return res.json({"status":1,"msg":"add activity success"});
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	});
});

router.get('/',function(req,res){
	let userId = req.query.userId;
	ActivityeModel.find({userId:userId}).sort({creatTime:-1}).then((activityList) => {
		return res.json({"status":1,activityList:activityList,"msg":"success"});
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
})

module.exports = router;