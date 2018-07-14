var webpack = require('webpack');
var path = require('path');
//使用 ExtractTextWebpackPlugin (将打好包的 CSS 提出出来并输出成 CSS 文件)。
var extractTextPlugin = require('extract-text-webpack-plugin');
var compressionPlugin = require('compression-webpack-plugin');
var htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry:{
		//__dirname是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
		pages:path.resolve(__dirname, './public/src/router.js'),//所有页面的入口
		vendors:['react','react-dom','react-router']//抽取公共框架
	},
	output:{
		path:__dirname+'/dist',
		publicPath:'/',
		filename:'js/bundle.js'
	},
	module:{
		rules:[
			{
				test:/\.css$/,
				use:extractTextPlugin.extract({
						fallback: 'style-loader',
				        use: 'css-loader'
				    })
			},
			{
				test:/\.scss$/,
				include:path.resolve(__dirname, './public/src/sass/global'),
				use:extractTextPlugin.extract({
						fallback: 'style-loader',
				        use: [
				        	{
				        		loader:'css-loader',
				        		options:{
				        			sourceMap:true
				        		}
				        	},
				        	{
				        		loader:'postcss-loader',
				        		options:{
				        			plugins: (loader) => [
	        			              require('autoprefixer'),
	        			            ],
	        			            sourceMap:true
				        		}
				        	},
				        	{
				        		loader:'sass-loader',
				        		options:{
				        			sourceMap:true,
				        			outputStyle:'expanded'
				        		}
				        	}
				        ]
			        })
			},
			{
				test:/\.scss$/,
				exclude:path.resolve(__dirname, './public/src/sass/global'),
				use:extractTextPlugin.extract({
						fallback: 'style-loader',
				        use: [
				        	{
				        		loader:'css-loader',
				        		options:{
				        			modules:true,
				        			localIdentName:'[name]-[local]-[hash:base64:5]',
				        			sourceMap:true
				        		}
				        	},
				        	{
				        		loader:'postcss-loader',
				        		options:{
				        			plugins: (loader) => [
	        			              require('autoprefixer'),
	        			            ],
	        			            sourceMap:true
				        		}
				        	},
				        	{
				        		loader:'sass-loader',
				        		options:{
				        			sourceMap:true,
				        			outputStyle:'expanded'
				        		}
				        	}
				        ]
			        })
			},
			{
	            test: /\.js$/,
	            enforce: 'pre',
	            use: [{
	                loader: 'eslint-loader', 
	                options: { fix: true }
	            }],
	            include: path.resolve(__dirname, './public/src/**/*.js'),
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
							name:'/images/[name].[ext]'
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
		new htmlWebpackPlugin({
			title: '',
			template: __dirname + '/public/index.html',
			inject:false
		}),
		// 压缩配置
		new webpack.optimize.UglifyJsPlugin({
		    compress: {
		        warnings: false
		    }
		}),
		// gzip压缩
		new compressionPlugin({
			asset: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
			algorithm: 'gzip',//算法
			test: new RegExp(
				 '\\.(js|css)$'    //压缩 js 与 css
			),
			threshold: 1024,//只处理比这个值大的资源。按字节计算
			minRatio: 0.8//只有压缩率比这个值小的资源才会被处理
	   }),
		// 配置环境变量到Production，防止控制台警告
		new webpack.DefinePlugin({
		  "process.env": { 
		     NODE_ENV: JSON.stringify("production") 
		   }
		})
	]
};