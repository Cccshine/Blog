import React from 'react';
import {NavLink} from 'react-router-dom';
import FontAwsome from 'font-awesome';

export default class Header extends React.Component{
	render(){
		return (
			<header>
				<div className="logo">
					<img src="../images/logo.jpg" alt="cshine"/>
				</div>
				<nav>
					<NavLink exact to="/" activeClassName="active">首页</NavLink>
					<NavLink to="/article-list">文章列表</NavLink>
					<NavLink to="/tag">标签</NavLink>
					<NavLink to="/archive">归档</NavLink>
					<NavLink to="/about">About Me</NavLink>
				</nav>
				<ul className="contact">
					<li><a href="" title="Github" className="fa fa-github"></a></li>
					<li><a href="" title="Segmentfault" className="fa fa-segmentfault"></a></li>
					<li><a href="" title="LinkedIn" className="fa fa-linkedin"></a></li>
					<li><a href="" title="Weibo" className="fa fa-weibo"></a></li>
					<li><a href="" title="Douban" className="fa fa-douban"></a></li>
				</ul>
			</header>
		)
	}
}