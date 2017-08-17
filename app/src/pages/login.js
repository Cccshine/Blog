import React from 'react';
import {Link} from 'react-router-dom';


class QuickLink extends React.Component{
	render(){
		return(
			<nav class="quick-link">
				<Link to="/" className="fa fa-home">首页</Link>
				<Link to="/register" className="fa fa-user-plus">注册</Link>
			</nav>
		)
	}
}
class LoginBox extends React.Component{
	render(){
		return(
			<div id="login-box" className="form-box">
				<h3>登录</h3>
				<form action="">
					<div className="form-group">
						<label htmlFor="username">用户名：</label>
						<input type="text" name="username" id="username"/>
					</div>
					<div className="form-group">
						<label htmlFor="password">密码：</label>
						<input type="password" name="password" id="password"/>
					</div>
					<input type="submit" name="login-btn" value="登录"/>
				</form>
			</div>
		)
	}
}
export default class Login extends React.Component{
	constructor(props){
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
	}
	handleLogin(e){
		this.props.history.push('/');
	}
	render(){
		return(
			<QuickLink />
			<div id="login-box" className="form-box">
				<h3>登录</h3>
				<form action="">
					<div className="form-group">
						<label htmlFor="username">用户名：</label>
						<input type="text" name="username" id="username"/>
					</div>
					<div className="form-group">
						<label htmlFor="password">密码：</label>
						<input type="password" name="password" id="password"/>
					</div>
					<input type="submit" name="login-btn" value="登录"/>
				</form>
			</div>
		)
	}
}