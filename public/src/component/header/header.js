import React from 'react';
import blogGlobal from '../../data/global';
import {NavLink,Link} from 'react-router-dom';
import CSSModules from 'react-css-modules';
import QuickLink from '../quickLink/quick-link';
import ContactIcon from '../contactIcon/contact-icon';
import style from './header.scss'

class Header extends React.Component{
	constructor(props){
		super(props);
		console.log(props)
		this.state = {
			isLogin:props.isLogin,
			username:props.username
		}
	}
	handleLogout = () => {
		let url = blogGlobal.requestBaseUrl+'/logout';
		fetch(url,{
			method:'GET',
			mode:'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
			this.setState({isLogin:false});
			sessionStorage.setItem('isLogin',false);
			sessionStorage.removeItem('username');
		}).catch((err) => {
			console.log(err)
		})
	}
	
	render(){
		return (
			<header styleName="top-header">
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
				<QuickLink pageName={this.state.isLogin ? 'logined' : 'index'} username={this.state.username} logout={this.handleLogout}/>
				<ContactIcon />
			</header>
		)
	}
}

export default CSSModules(Header, style,{handleNotFoundStyleName:'log'});