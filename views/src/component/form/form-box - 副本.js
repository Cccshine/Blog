import React from 'react';
import CSSModules from 'react-css-modules';
import style from './form-box.scss'

class FormBox extends React.Component{
	constructor(props) {
		super(props);
	    this.state = {
	      username:'',
	      password:''
	    };
	    if(this.props.pageName == 'register')
	    	this.setState({comfirmPassword:''});
	    this.handleEmailChange = this.handleEmailChange.bind(this);
	    this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(event){
		event.preventDefault();
	}
	render(){
		var mode = this.props.pageName == 'login' ? '登录' : '注册';
		var name = this.props.pageName == 'login' ? 'login-btn' : 'register-btn';
		return (
			<div styleName="form-box">
				<form onSubmit={this.handleSubmit}>
					<div styleName="form-group" className="fa fa-user">
						<input type="text" name="username" id="username" placeholder="用户名"/>
					</div>
					<div styleName="form-group" className="fa fa-lock">
						<input type="password" name="password" id="password" placeholder="密码"/>
					</div>
					{this.props.pageName == 'register' ? <div styleName="form-group" className="fa fa-lock">
						<input type="password" name="password"  placeholder="确认密码"/>
					</div> : ''}
					<button styleName="operate-btn" name={name}>{mode}</button>
				</form>
			</div>
		)
	}
}

export default CSSModules(FormBox, style,{handleNotFoundStyleName:'log'});
