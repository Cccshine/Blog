import React from 'react';
import {NavLink,Link} from 'react-router-dom';
import ContactIcon from './contact-icon';


import style from '../../sass/public/header.scss'

export default class Header extends React.Component{
	render(){
		return (
			<header>
				<div id="logo">
					<img src={require('../../images/logo.jpg')}  alt="cshine"/>
				</div>
				<nav>
					<NavLink exact to="/" activeClassName="active-nav">首页</NavLink>
					<NavLink to="/article-list" activeClassName="active-nav">文章列表</NavLink>
					<NavLink to="/tag" activeClassName="active-nav">标签</NavLink>
					<NavLink to="/archive" activeClassName="active-nav">归档</NavLink>
					<NavLink to="/about" activeClassName="active-nav">About Me</NavLink>
				</nav>
				<div id="user">
					<Link to="/login">登录</Link>
					<Link to="/register">注册</Link>
				</div>
				<ContactIcon />
			</header>
		)
	}
}