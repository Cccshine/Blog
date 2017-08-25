const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const config = require('config-lite');
const DB_CONN_STR = 'mongodb://localhost/runoob';

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({ extended: true }) ); // to support URL-encoded bodies

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});
app.post('/register', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;

	let queryData = function(db,callback){
		let queryStr = {"username":username};
		let collection = db.collection('site');
		collection.find(queryStr).toArray(function(err,result){
			if(err){
				console.log('Error'+err);
				return;
			}
			callback(result);
		});
	}

	MongoClient.connect(DB_CONN_STR,function(err,db){
		console.log('连接成功');
		queryData(db,function(result){
			console.log(result);
			if(result.length > 0){
				res.json({"status":1});
				db.close();
				return;
			}else{
				let insertData = function(db,callback){
					let data = [{"username":username,"password":password}];
					let collection = db.collection('site');
					collection.insert(data,function(err,result){
						if(err){
							console.log('Error'+err);
							return;
						}
						callback(result);
					});
				}
				MongoClient.connect(DB_CONN_STR,function(err,db){
					console.log('连接成功');
					insertData(db,function(result){
						console.log(result);
						db.close()
					})
				})
			}
			
		})
	})
    res.json({"status":0});
});

app.listen(4000);

// var express = require("express");
// var path = require("path");
// var bodyParser = require("body-parser");
// var app = express();
// //设置应用程序的静态路径
// app.use(express.static(path.join(__dirname,"/views")));
// app.listen(4000,function(){
//     console.log("Started listening on port", 4000);
// })

// app.use(bodyParser.json());

// app.post('/register', function (req, res) {
// 	// var user_name=req.body.email;
//  //  	var password=req.body.password
//  var name = req.body.name;
//  console.log(req.body)
//   res.send(req.body);
//    //  if(user_name=='admin' && password=='admin'){
//    //  	res.send('success');
//    //  }
//    //  else{
//    //  	res.send('Failure');
//   	// }
// });


// var path = require('path');
// var express = require('express');
// var webpack = require('webpack');
// var config = require('./webpack.config');//webpack.config.js同一目录
// var port = 3000;
// var app = express();
// var compiler = webpack(config);
// //内存生成的js文件，请求第一优先
// app.use(require('webpack-dev-middleware')(compiler, {
//     noInfo: true,
//     publicPath: config.output.publicPath,//必须跟webpack.config.js的ouput.publickPath一致
// }));
// //设置路径不存在(webpack-dev-middleware内存中也不存在)时访问静态文件目录，请求第二优先
// app.use(express.static(path.join(__dirname, './views')));
// app.use(require('webpack-hot-middleware')(compiler));
// //上面静态文件访问不存在时，所有请求都定位到index.html文件，最后都找不到的请求都访问index.html
// app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, './views/index.html'));
// });
// var host = "localhost"
// app.listen(port, host, function(err) {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.info("==> 🌎  Listening on port %s. Open up http://"+host+":%s/ in your browser.",     port, port)
// });


// var http = require('http');
// var MongoClient = require('mongodb').MongoClient;
// var DB_CONN_STR = 'mongodb://localhost/runoob';

// var insertData = function(db,callback){
// 	var collection = db.collection('site');
// 	var data = [{"name":"菜鸟教程","url":"www.runoob.com"},{"name":"菜鸟工具","url":"c.runoob.com"}];
// 	collection.insert(data,function(err,result){
// 		if(err){
// 			console.log('Error'+err);
// 			return;
// 		}
// 		callback(result);
// 	});
// }
// MongoClient.connect(DB_CONN_STR,function(err,db){
// 	console.log('连接成功');
// 	insertData(db,function(result){
// 		console.log(result);
// 		db.close()
// 	})
// })

// http.createServer(function(request,response){
// 	response.writeHead(200,{'Content-Type':'text/plain'});
// 	response.end('Hello World')
// }).listen(8888);
// console.log('Server running at http://127.0.0.1:8888/');