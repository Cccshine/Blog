var webpack = require('webpack');
var path = require('path');
//使用 ExtractTextWebpackPlugin (将打好包的 CSS 提出出来并输出成 CSS 文件)。
var extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry:{
		//__dirname是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
		pages:__dirname+'/app/src/router.js',//所有页面的入口
		vendors:['react','react-dom','react-router']//抽取公共框架
	},
	output:{
		path:__dirname+'/app/dist',
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
	            test: /\.js[x]?$/,
	            enforce: 'pre',
	            use: [{
	                loader: 'eslint-loader', 
	                options: { fix: true }
	            }],
	            include: path.resolve(__dirname, './app/src/**/*.js'),
	            exclude: /node_modules/
	        },
			{
				test:/\.js[x]?$/,
				exclude:/node_modules/,
				use:'babel-loader'
			},
			{
				test:/\.(png|jpg)$/,
				use:{
						loader:'url-loader',//名称
						options:{//其他配置选项
							limit:8192,
							name:'images/[name].[ext]'
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
		// 压缩配置
		new webpack.optimize.UglifyJsPlugin({
		    compress: {
		        warnings: false
		    }
		}),
		// 配置环境变量到Production，防止控制台警告
		new webpack.DefinePlugin({
		  "process.env": { 
		     NODE_ENV: JSON.stringify("production") 
		   }
		})
	]
};