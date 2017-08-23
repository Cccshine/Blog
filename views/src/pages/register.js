import React from 'react';
import TipBar from '../component/tipBar/tip-bar';
import QuickLink from '../component/quickLink/quick-link';
import CSSModules from 'react-css-modules';
import style from '../component/formBox/form-box.scss';

class Login extends React.Component{
	constructor(props){
		super(props);
		this.state = {
	      userName:'',
	      password:'',
	      comfirmPassword:'',
	      userNameErr:'',
	      userNamePass:false,
	      userNameInfo:'只包含汉字、数字、字母、下划线其中一种或几种，长度不能超过10',
	      passowrdErr:'',
	      passowrdPass:false,
	      passowrdInfo:'必须包含数字、字母、下划线其中两种，长度不小于8'
	    };
	}
	handleUserNameChange = (event) => {
		var value = event.target.value;
		this.setState({userName:value});
		if(value === ''){
			this.setState({userNameErr:'用户名不能为空'});
			return;
		}else if(value.length > 10){
			this.setState({userNameErr:'用户名长度不能超过10个字符'});
			return;
		}else if(value.match(/[^a-zA-Z0-9_\u4e00-\u9fa5]+/)){//只含有汉字、数字、字母、下划线
			this.setState({userNameErr:'用户名只能含有汉字、数字、字母、下划线'});
			return;
		}else{
			this.setState({userNamePass:true});
		}
	}
	handlePasswordChange = (event) => {
		var value = event.target.value;
		this.setState({password:value});
		event.preventDefault();
	}
	handleComfirmPasswordChange = (event) => {
		var value = event.target.value;
		this.setState({comfirmPassword:value});
		event.preventDefault();
	}
	handleSubmit = (event) => {
		event.preventDefault();
	}
	render(){
		var tipType = this.state.userNameErr === '' ? 'info' : (this.state.userNamePass ? 'success' : 'error');
		var tipText = this.state.userNamePass ?  this.state.userNameErr : (this.state.userNameErr === '' ? this.state.userNameInfo : '符合规则');
		return(
			<div>
				<QuickLink pageName="register"/>
				<div styleName="form-box">
					<form onSubmit={this.handleSubmit}>
						<div styleName="form-group" className="fa fa-user">
							<input type="text" name="username" id="username" placeholder="用户名" onChange={this.handleUserNameChange}/>
							<TipBar type={tipType} text={tipText}/>
						</div>
						<div styleName="form-group" className="fa fa-lock">
							<input type="password" name="password" id="password" placeholder="密码" onChange={this.handlePasswordChange}/>
							<TipBar type={tipType} text={tipText}/>
						</div>
						<div styleName="form-group" className="fa fa-lock">
							<input type="password" name="password"  placeholder="确认密码" onChange={this.handleComfirmPasswordChange}/>
							<TipBar type={tipType} text={tipText}/>
						</div>
						<button styleName="operate-btn" name="login-btn">注册</button>
					</form>
				</div>
			</div>
		)
	}
}


export default CSSModules(Login, style,{handleNotFoundStyleName:'log'});
