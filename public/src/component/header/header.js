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
			isLogin:props.isLogin,
			role:props.role,
		}
	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({isLogin:nextProps.isLogin,role:nextProps.role});
	}


	render(){
		let {isLogin,role} = this.state;
		let quickLinkProps = {
			pageName:isLogin ? 'logined' : 'index',
			username:this.props.username,
			logout:this.props.handleLogout
		}
		return (
			<header styleName="top-header">
				<div styleName="logo">
					<img src={require('../../images/logo.jpg')}  alt="cshine"/>
				</div>
				<nav styleName="header-nav">
					<NavLink exact to='/' activeClassName="active-nav">首页</NavLink>
					<NavLink to="/tag" activeClassName="active-nav">标签</NavLink>
					<NavLink to="/archive" activeClassName="active-nav">归档</NavLink>
					<NavLink to="/about" activeClassName="active-nav">About Me</NavLink>
					{role == 1 ? <NavLink to="/article" activeClassName="active-nav">写文章</NavLink> : null}
					{role == 1 ? <NavLink to="/draft" activeClassName="active-nav">草稿箱</NavLink> : null}
				</nav>
				<QuickLink {...quickLinkProps}/>
				<ContactIcon />
			</header>
		)
	}
}

export default CSSModules(Header, style,{handleNotFoundStyleName:'log'});