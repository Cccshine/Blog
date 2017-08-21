import React from 'react';
import {NavLink,Link} from 'react-router-dom';
import CSSModules from 'react-css-modules';
import QuickLink from '../quickLink/quick-link';
import ContactIcon from '../contactIcon/contact-icon';
import style from './header.scss'

class Header extends React.Component{
	render(){
		return (
			<header>
				<div styleName="logo">
					<img src={require('../../images/logo.jpg')}  alt="cshine"/>
				</div>
				<nav styleName="header-nav">
					<NavLink exact to="/" activeClassName="active-nav">首页</NavLink>
					<NavLink to="/article-list" activeClassName="active-nav">文章列表</NavLink>
					<NavLink to="/tag" activeClassName="active-nav">标签</NavLink>
					<NavLink to="/archive" activeClassName="active-nav">归档</NavLink>
					<NavLink to="/about" activeClassName="active-nav">About Me</NavLink>
				</nav>
				<div>
					<QuickLink />
				</div>
				<ContactIcon />
			</header>
		)
	}
}

export default CSSModules(Header, style,{handleNotFoundStyleName:'log'});