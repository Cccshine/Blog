const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ActivityeModel = mongoose.model('Activity');
router.post('/',function(req,res){
    let {userId,articleId,activityMode} = req.body;
    let _activity = {
		article:articleId,
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
	let {userId,lastTime,currentPage,pageSize,dir} = req.query;
	currentPage = Number(currentPage);
	pageSize = Number(pageSize);
	dir = Number(dir);
	if(currentPage === 0){//第一页
		ActivityeModel.find({userId:userId}).then((activityList) => {//第一页时更新总数及总页数
			activityPageTotal = Math.ceil(activityList.length/pageSize);
			activityTotal = activityList.length;
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		})
		ActivityeModel.find({userId:userId}).sort({createTime:-1}).limit(pageSize).populate('article').then((activityList) => {
			if(activityList.length > 0){
				return res.json({"status":1,"activityList":activityList,"pageTotal":activityPageTotal,"msg":"get success"});
			}else{
				return res.json({"status":0,"activityList":activityList,"pageTotal":activityPageTotal,"msg":"no activity"});
			}
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		})
	}else if(currentPage === activityPageTotal - 1){//最后一页
		let limit = activityTotal - activityPageTotal*pageSize;
		ActivityeModel.find({userId:userId}).sort({createTime:1}).limit(limit).populate('article').then((activityList) => {
			if(activityList.length > 0){
				return res.json({"status":1,"activityList":activityList,"pageTotal":activityPageTotal,"msg":"get success"});
			}else{
				return res.json({"status":0,"activityList":activityList,"pageTotal":activityPageTotal,"msg":"no activity"});
			}
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		})
	}else if(dir > 0){//下一页
		ActivityeModel.find({userId:userId,createTime:{$lt:lastTime}}).sort({createTime:-1}).limit(pageSize).populate('article').then((activityList) => {
			if(activityList.length > 0){
				return res.json({"status":1,"activityList":activityList,"pageTotal":activityPageTotal,"msg":"get success"});
			}else{
				return res.json({"status":0,"activityList":activityList,"pageTotal":activityPageTotal,"msg":"no activity"});
			}
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		})
	}else{//上一页
		let skipNum = 0;
		if(currentPage === activityPageTotal - 2){
			skipNum = activityTotal - (currentPage+1)*pageSize - 1;
		}else{
			skipNum = pageSize - 1;
		}
		ActivityeModel.find({userId:userId,createTime:{$gt:lastTime}}).sort({createTime:1}).skip(skipNum).limit(pageSize).populate('article').then((activityList) => {
			activityList.reverse();
			if(activityList.length > 0){
				return res.json({"status":1,"activityList":activityList,"pageTotal":activityPageTotal,"msg":"get success"});
			}else{
				return res.json({"status":0,"activityList":activityList,"pageTotal":activityPageTotal,"msg":"no activity"});
			}
		}).catch((err) => {
			console.log(err);
			res.status(500).send('Something broke!');
		})
	}
	// ActivityeModel.find({userId:userId}).sort({createTime:-1}).populate('article').then((activityList) => {
	// 	return res.json({"status":1,activityList:activityList,"msg":"success"});
	// }).catch((err) => {
	// 	console.log(err);
	// 	res.status(500).send('Something broke!');
	// })
})

module.exports = router;