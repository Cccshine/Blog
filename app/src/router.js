import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,Route,Switch} from 'react-router-dom';


import Login from './pages/login.js';
import App from './app';

//配置路由，将路由注入到id为blog的DOM中
ReactDOM.render(
	<BrowserRouter> 
		<Switch>
			<Route path="/login" component={Login}/>
			<Route path="/" component={App}/> 
		</Switch>
	</BrowserRouter>,document.getElementById('blog'));