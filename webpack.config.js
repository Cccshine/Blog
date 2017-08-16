var webpack = require('webpack');
var path = require('path');
//使用 ExtractTextWebpackPlugin (将打好包的 CSS 提出出来并输出成 CSS 文件)。
var extractTextPlugin = require('extract-text-webpack-plugin');
//在热更新模式下，编译完成后自动打开浏览器
var openBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
	//配置服务器//详细见https://webpack.github.io/docs/webpack-dev-server.html#webpack-dev-server-cli
	devServer:{
		//浏览器刷新时所有的路径都执行index.html。
		historyApiFallback:true,
		//热更新
		hot:true,
		//自动刷新模式为内联模式（还有iframe模式）
		inline:true,
		//设定webpack-dev-server伺服的directory。如果不进行设定的话，默认是在当前目录下
		contentBase:'./app',
		port:3000
	},
	//在控制台的sources下，点开可以看到webpack://目录，里面可以直接看到我们开发态的源代码，这样方便我们直接在浏览器中打断点调试
	devtool:"eval-source-map",  
	entry:{
		//__dirname是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
		pages:path.resolve(__dirname, './app/src/router.js'),//所有页面的入口
		vendors:['react','react-dom','react-router','font-awesome']//抽取公共框架
	},
	output:{
		// path:__dirname+'/dist',
		publicPath:'dist',
		filename:'js/bundle.js'
	},
	module:{
		rules:[
			{
				test:/\.css$/,
				use: extractTextPlugin.extract({
				        fallback: 'style-loader',
				        use: 'css-loader'
			        })
			},
			{
				test:/\.scss$/,
				use: extractTextPlugin.extract({
				        use: 'css-loader!sass-loader'
			        })
			},
			{
	            test: /\.js$/,
	            enforce: 'pre',
	            use: [{
	                loader: 'eslint-loader', 
	                options: { fix: true }
	            }],
	            include: path.resolve(__dirname, './app/src/**/*.js'),
	            exclude: /node_modules/
	        },
			{
				test:/\.js$/,
				exclude:/node_modules/,
				use:'babel-loader'
			},
			{
				test:/\.(png|jpg)$/,
				use:{
						loader:'url-loader',//名称
						options:{//其他配置选项
							limit:8192,
							name:'/img/[name].[ext]'
						}
					}
			},
			{
				test:/\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
				use:'url-loader',
			},
		]
	},
	resolve:{
		extensions: ['.js', '.jsx']
	},
	plugins:[
	//Common Chunks 插件的作用就是提取代码中的公共模块，然后将公共模块打包到一个独立的文件中去，以便在其它的入口和模块中使用。
		new webpack.optimize.CommonsChunkPlugin({name:'vendors',filename:'js/vendors.js'}),
		new extractTextPlugin({filename:'css/bundle.css'}),
		// new webpack.ProvidePlugin({$:'jquery'}),
		new webpack.HotModuleReplacementPlugin(),
		new openBrowserPlugin({url:'http://localhost:3000/'})
	]
};