import React from 'react';
import {Link} from 'react-router-dom';
import CSSModules from 'react-css-modules';
import style from './quick-link.scss'

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
		var links = <Link to="login" styleName="quick-link-item">登录</Link><Link to="/register" className="fa fa-user-plus" styleName="quick-link-item">注册</Link>;;
		if(this.state.pageName == '/login'){
			links = <Link to="/" className="fa fa-home" styleName="quick-link-item">首页</Link><Link to="/register" className="fa fa-user-plus" styleName="quick-link-item">注册</Link>;
		}else if(this.state.pageName == '/register'){
			links = <Link to="/" className="fa fa-home" styleName="quick-link-item">首页</Link><Link to="/login" className="fa fa-sign-in" styleName="quick-link-item">登录</Link>;
		}
		return (
			<nav styleName="quick-link">
			{links}
			</nav>
		)
	}
}

export default CSSModules(QuickLink,style,{handleNotFoundStyleName:'log'});