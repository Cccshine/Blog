import React from 'react';
import {Link} from 'react-router-dom';

export default class Header extends React.Component{
	render(){
		return (
			<nav>
				<Link to="/home">首页</Link>
				<Link to="/article-list">文章列表</Link>
				<Link to="tag">标签</Link>
				<Link to="archive">归档</Link>
				<Link to="about">About Me</Link>
			</nav>
		)
	}
}