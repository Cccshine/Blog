import React from 'react';
import {Link} from 'react-router-dom';


class QuickLink extends React.Component{
	render(){
		return(
			<nav className="quick-link">
				<Link to="/" className="fa fa-home">首页</Link>
				<Link to="/register" className="fa fa-user-plus">注册</Link>
			</nav>
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
			<div>
				<QuickLink />
				<div id="login-box" className="form-box">
					<h3>登录</h3>
					<form action="" method="post">
						<div className="form-group">
							<label htmlFor="username">用户名：</label>
							<input type="text" name="username" id="username"/>
						</div>
						<div className="form-group">
							<label htmlFor="password">密码：</label>
							<input type="password" name="password" id="password"/>
						</div>
						<button type="button" name="login-btn" onClick={this.handleLogin}>登录</button>
					</form>
				</div>
			</div>
		)
	}
}