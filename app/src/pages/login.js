import React from 'react';
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();

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
				<h1>我是登录注册页</h1>
				<button id="login-btn" onClick={this.handleLogin}>登录</button>
			</div>
		)
	}
}