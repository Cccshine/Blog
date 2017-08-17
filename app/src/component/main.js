import React from 'react';
import ReactDOM from 'react-dom';
import {Route,Switch} from 'react-router-dom';

import Home from '../pages/home';
import Article from '../pages/article';
import Tag from '../pages/tag';
import Archive from '../pages/archive';
import About from '../pages/about';
import Login from '../pages/login.js';
import Register from '../pages/register.js';


export default class Main extends React.Component{
	render(){
		return (
			<main>
			    <Switch>
			    	<Route exact path='/' component={Home}/>
				    <Route path="/article-list" component={Article}/>
					<Route path="/tag" component={Tag}/>
					<Route path="/archive" component={Archive}/>
					<Route path="/about" component={About}/>
					<Route path="/login" component={About}/>
					<Route path="/register" component={About}/>
			    </Switch>
		   </main>
		)
	}
}