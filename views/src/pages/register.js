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
	      passwordErr:'',
	      passwordPass:false,
	      passwordInfo:'必须包含数字、字母、下划线其中两种，长度不小于8',
	      comfirmPasswordErr:'',
	      comfirmPasswordPass:false
	    };
	}
	handleUserNameChange = (event) => {
		var value = event.target.value;
		this.setState({userName:value});
		if(value === ''){
			this.setState({userNameErr:'用户名不能为空',userNamePass:false});
			return;
		}else if(value.length > 10){
			this.setState({userNameErr:'用户名长度不能超过10个字符',userNamePass:false});
			return;
		}else if(value.match(/[^a-zA-Z0-9_\u4e00-\u9fa5]+/)){//只含有汉字、数字、字母、下划线
			this.setState({userNameErr:'用户名只能含有汉字、数字、字母、下划线',userNamePass:false});
			return;
		}else{
			this.setState({userNamePass:true});
		}
	}
	handlePasswordChange = (event) => {
		var value = event.target.value;
		this.setState({password:value});
		if(value === ''){
			this.setState({passwordErr:'密码不能为空',passwordPass:false});
			return;
		}else if(value.length < 8){
			this.setState({passwordErr:'密码长度不能少于8个字符',passwordPass:false});
			return;
		}else if(value.match(/^[0-9]+$/) || value.match(/^[a-zA-Z]+$/) || value.match(/^[_]+$/)){
			this.setState({passwordErr:'密码必须包含数字、字母、下划线其中两种',passwordPass:false});
			return;
		}else{
			this.setState({passwordPass:true});
		}
	}
	handleComfirmPasswordChange = (event) => {
		var value = event.target.value;
		// this.setState({comfirmPassword:value});
		// if(value !== this.state.password){
		// 	this.setState({comfirmPasswordErr:'两次输入密码不一致',comfirmPasswordPass:false});
		// 	return;
		// }
		// this.setState({comfirmPasswordErr:'',comfirmPasswordPass:true});
	}
	handleSubmit = (event) => {
		event.preventDefault();
	}
	render(){
		var userNameTipType = this.state.userNamePass ?  'success' : (this.state.userNameErr === '' ? 'info' : 'error');
		var userNameTipText = this.state.userNamePass ?  '符合规则' : (this.state.userNameErr === '' ? this.state.userNameInfo : this.state.userNameErr);
		var passwordTipType = this.state.passwordPass ?  'success' : (this.state.passwordErr === '' ? 'info' : 'error');
		var passwordTipText = this.state.passwordPass ?  '符合规则' : (this.state.passwordErr === '' ? this.state.passwordInfo : this.state.passwordErr);
		return(
			<div>
				<QuickLink pageName="register"/>
				<div styleName="form-box">
					<form onSubmit={this.handleSubmit}>
						<div styleName="form-group" className="fa fa-user">
							<input type="text" name="username" id="username" placeholder="用户名" onChange={this.handleUserNameChange}/>
							<TipBar type={userNameTipType} text={userNameTipText}/>
						</div>
						<div styleName="form-group" className="fa fa-lock">
							<input type="password" name="password" id="password" placeholder="密码" onChange={this.handlePasswordChange}/>
							<TipBar type={passwordTipType} text={passwordTipText}/>
						</div>
						<div styleName="form-group" className="fa fa-lock">
							<input type="password" name="password"  placeholder="确认密码" onChange={this.handleComfirmPasswordChange}/>
							// {this.state.comfirmPasswordErr == '' ? '' : <TipBar type="error" text={this.state.comfirmPasswordErr}/>}
						</div>
						<button styleName="operate-btn" name="login-btn">注册</button>
					</form>
				</div>
			</div>
		)
	}
}


export default CSSModules(Login, style,{handleNotFoundStyleName:'log'});
