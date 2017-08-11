import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';

// 引入单个页面（包括嵌套的子页面
import Main from './main';

//配置路由，将路由注入到id为app的DOM中
ReactDOM.render(
	<BrowserRouter> 
		<div>
			<Route path="/" component={Main}/> 
		</div>
	</BrowserRouter>,document.getElementById('blog'));