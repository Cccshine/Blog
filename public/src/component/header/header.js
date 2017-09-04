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
		this.state = {
			isLogin:false
		}
	}
	componentDidMount = () => {
		let url = blogGlobal.requestBaseUrl;
		fetch(url,{
			method:'GET',
			headers:{
				'Accept':'application/json',
				'Content-Type':'application/json'
			},
			mode:'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json,json.isLogin)
			this.setState({isLogin:json.isLogin});
			if(json.username){
				this.setState({username:json.username});
			}else{
				alert('您暂未登录，是否前往登录页登录')
			}
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
				<QuickLink pageName="index"/>
				<ContactIcon />
			</header>
		)
	}
}

export default CSSModules(Header, style,{handleNotFoundStyleName:'log'});