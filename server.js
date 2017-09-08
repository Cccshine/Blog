const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const moment = require('moment');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');//session依赖cookieParser
const mongoStore = require('connect-mongo')(session);//将 session 存储于 mongodb，结合 express-session 使用
const config = require('config-lite')(__dirname);
const userModel = require('./models/user');
const articleModel = require('./models/article');
const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const articleRouter = require('./routes/article');

const app = express();


// 设置监听端口,环境变量要是设置了PORT就用环境变量的PORT
const port = process.env.PORT || config.port;
mongoose.Promise = global.Promise
//连接数据库
mongoose.connect(config.mongodb,{useMongoClient:true});
const db = mongoose.connection;;
db.on('error', console.error.bind(console,'connection error!'));
db.once('open', function() {
  console.log('connection successful!')
});
app.use(cookieParser('cshine'));
app.use(session({
    name: config.session.key,// 设置 cookie 中保存session id的字段名称
    secret: config.session.secret,// 通过设置secret来计算hash值并放在cookie中，使产生的signedCookie防篡改
    resave:config.session.resave,// 默认为 true , 若为 true 会强制重新存储 session 到数据库，即使在请求过程中没有改变 session 内容
    rolling:config.session.rolling,//默认为false， 在每次请求后的响应中设置cookie，这将重置cookie过期时间
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后cookie中的session id自动删除
    },
    saveUninitialized: config.session.saveUninitialized,//是否强制保存未初始化的session
    store: new mongoStore({// 将 session 存储到 mongodb
        url: config.mongodb// mongodb 地址
    })
}));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({ extended: true }) ); // to support URL-encoded bodies

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS,UPDATE");
    res.header("Access-Control-Allow-Credentials",true);
    next();
});

app.use('/api/', indexRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/articles', articleRouter);

app.listen(port);

