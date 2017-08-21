import React from 'react';
import CSSModules from 'react-css-modules';
import style from './form-box.scss'

class FormBox extends React.Component{
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
		return (
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
		)
	}
}

export default CSSModules(Header, style,{handleNotFoundStyleName:'log'});
