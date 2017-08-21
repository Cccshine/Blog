import React from 'react';
import {Link} from 'react-router-dom';
import CSSModules from 'react-css-modules';
import style from './quick-link.scss'

function LoginLink(){
	return (
		<nav styleName="quick-link">
			<Link to="/" className="fa fa-home" styleName="quick-link-item">首页</Link><Link to="/register" className="fa fa-user-plus" styleName="quick-link-item">注册</Link>,
		</nav>
	)
} 
function IndexLink(){
	return (
		<nav styleName="quick-link">
			<Link to="/login" styleName="quick-link-item">登录</Link><Link to="/register" styleName="quick-link-item">注册</Link>,
		</nav>
	)
} 
function RegisterLink(){
	return (
		<nav styleName="quick-link">
			<Link to="/" className="fa fa-home" styleName="quick-link-item">首页</Link><Link to="/login" className="fa fa-sign-in" styleName="quick-link-item">登录</Link>
		</nav>
	)
} 

class QuickLink extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			pageName:""
		}
		this.componentWillMount = this.componentWillMount.bind(this);
	}
	componentWillMount(){
		this.setState({pageName:window.location.pathname});
	}
	render(){
		switch(this.state.pageName){
			case '/login':
				return <LoginLink />
			case '/register':
				return <RegisterLink />
			default:
				return <IndexLink />
		}
	}
}

export default CSSModules(QuickLink,style,{handleNotFoundStyleName:'log'});