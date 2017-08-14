import React from 'react';
import {NavLink} from 'react-router-dom';

export default class Header extends React.Component{
	render(){
		return (
			<nav>
				<NavLink exact to="/" activeClassName="active">首页</NavLink>
				<NavLink to="/article-list">文章列表</NavLink>
				<NavLink to="/tag">标签</NavLink>
				<NavLink to="/archive">归档</NavLink>
				<NavLink to="/about">About Me</NavLink>
			</nav>
		)
	}
}