import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,Route,Switch} from 'react-router-dom';


import Login from './pages/login.js';
import Register from './pages/register.js';
import Forget from './pages/forget.js';
import App from './app';

import './sass/global/_common.scss';
import 'highlight.js/styles/monokai-sublime.css';

//配置路由，将路由注入到id为blog的DOM中
ReactDOM.render(
	<BrowserRouter> 
		<Switch>
			<Route path="/login" component={Login}/>
			<Route path="/register" component={Register}/>
			<Route path="/forget" component={Forget}/>
			<Route path="/" component={App}/> 
		</Switch>
	</BrowserRouter>,document.getElementById('blog'));