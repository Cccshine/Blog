# Blog
在线查看：[http://www.cshine.xin](http://www.cshine.xin)

# Introduction
使用`Sass`+`React`+`Node.js`+`Express`+`MongoDB`+`Webpack`开发的个人博客

包含注册、登陆、找回密码、邮箱验证、消息推送、`markdown`编辑器写文章（含预览效果）、自动保存草稿、点赞、收藏、评论、按标签归类、按月份归类、分页查看等功能

# Usage
1. `Clone` 到本地
2. 由于使用了`nginx`进行反向代理，所以需要安装`nginx`，安装方法可`Google`；安装完成后可在`nginx.conf`下进行如下配置：
```
    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
            proxy_pass http://127.0.0.1:3030;
        }

        location ^~ /apis {
            rewrite  ^.+apis/?(.*)$ /$1 break;
            include  uwsgi_params;
            proxy_pass   http://localhost:3000;
       }
    }
```
配置完成后启动`nginx`

3. 由于使用了`MongoDB`，所以需要安装`MongoDB`,安装方法可`Google`;安装完成后启动`MongoDB`

4. `cd`到项目文件，然后命令行下运行（需要先安装好`Node.js`）
```
  $ npm install
```

5. 依赖安装完成后，执行`npm start`,`npm run server`；浏览器进入`localhost`即可查看到页面。

