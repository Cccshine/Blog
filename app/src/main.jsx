import React from 'react';
import ReactDOM from 'react-dom';
import {Route} from 'react-router-dom';

import Home from './pages/home';
import Article from './pages/article';
import Tag from './pages/tag';
import Archive from './pages/archive';
import About from './pages/about';

import Header from './component/header'

import 'es5-shim';
//为当前环境提供一个垫片babel-polyfill,来转换JavaScript新的API
import 'babel-polyfill';

import './sass/main.scss'

export default class Main extends React.Component{
	constructor(props){
		super(props);
	}
	componentDidMount(){
		this.props.history.push('home');
	}
	render(){
		return(
			<div id="main">
				<Header/>
				<div id="content">
					<Route path="/home" component={Home}/>
					<Route path="/article-list" component={Article}/>
					<Route path="/tag" component={Tag}/>
					<Route path="/archive" component={Archive}/>
					<Route path="/about" component={About}/>
				</div>
			</div>
		)
	}
}