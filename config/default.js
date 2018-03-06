module.exports = {
    port: 4000,
    session: {
        secret: 'cshine',
        key: 'cshine',
        resave:false,
        rolling:true,
        saveUninitialized:false,
        maxAge: 2592000000,
    },
    smtpConfig:{
        service: 'QQ',
        auth: {
            user: '1071762488@qq.com',//发送者邮箱
            pass: 'lxwhuloqtiiobcde' //邮箱第三方登录授权码
        },
    },
    mongodb: 'mongodb://localhost:27017/runoob'
};