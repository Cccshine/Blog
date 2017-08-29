const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');//session依赖cookieParser
const mongoStore = require('connect-mongo')(session);//将 session 存储于 mongodb，结合 express-session 使用
const config = require('config-lite')(__dirname);
const userModel = require('./models/user');
const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');

const app = express();
// 设置监听端口,环境变量要是设置了PORT就用环境变量的PORT
const port = process.env.PORT || 4000;
//连接数据库
mongoose.connect(config.mongodb);
const db = mongoose.connection;;
db.on('error', console.error.bind(console,'connection error!'));
db.once('open', function() {
  console.log('connection successful!')
});

app.use(cookieParser());
app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave:config.session.resave,//设置是否在session有更改时才进行保存
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new mongoStore({// 将 session 存储到 mongodb
        url: config.mongodb// mongodb 地址
    })
}));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({ extended: true }) ); // to support URL-encoded bodies

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.use('/', indexRouter);
app.use('/register', registerRouter);

app.listen(4000);

