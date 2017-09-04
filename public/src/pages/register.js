import React from 'react';
import SHA from 'sha1';
import blogGlobal from '../data/global';
import TipBar from '../component/tipBar/tip-bar';
import QuickLink from '../component/quickLink/quick-link';
import ValidateInput from '../component/form/validate-input';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/register.scss';
import '../sass/global/_form-box.scss';

class Register extends React.Component{
	constructor(props){
		super(props);
		this.state = {
		    username:'',
		    password:'',
		    email:'',
		    comfirmPassword:'',
		    usernameTip:blogGlobal.usernameRuleTip,
		    passwordTip:blogGlobal.passwordRuleTip,
		    emailTip:'',
		    comfirmPasswordTip:'',
		    usernameStatus:0,//0--提示 1--错误 2--通过
		    passwordStatus:0,//0--提示 1--错误 2--通过
		    emailStatus:0,//0--提示 1--错误 2--通过
		    comfirmPasswordStatus:0,//0--正获得焦点 1--错误 2--通过
		    dbStatus:0,//0--暂未点击注册 1--用户已存在  2--成功
		    dbTip:''
		};
	}

	handleUserNameChange = (event) => {
		let value = event.target.value;
		this.setState({username:value});
		if(value === ''){
			this.setState({
				usernameTip:blogGlobal.usernameRuleTip,
				usernameStatus:0
			});
			return;
		}else if(value.length > 10){
			this.setState({
				usernameTip:blogGlobal.usernameRuleErrLength,
				usernameStatus:1
			});
			return;
		}else if(value.match(/[^a-zA-Z0-9_\u4e00-\u9fa5]+/)){//只含有汉字、数字、字母、下划线
			this.setState({
				usernameTip:blogGlobal.usernameRuleErrType,
				usernameStatus:1
			});
			return;
		}
		this.setState({
			usernameTip:blogGlobal.rulePassTip,
			usernameStatus:2
		});
	}
	handleUserNameFocus = (event) => {
		if(this.state.username.trim() === ''){
			this.setState({
				usernameTip:blogGlobal.usernameRuleTip,
				usernameStatus:0
			});
		}
	}
	handleUserNameBlur = (event) => {
		if(this.state.username.trim() === ''){
			this.setState({
				usernameTip:blogGlobal.usernameNullTip,
				usernameStatus:1
			});
		}
	}
	handlePasswordChange = (event) => {
		let value = event.target.value;
		this.setState({password:value});
		if(value === ''){
			this.setState({
				passwordTip:blogGlobal.passwordRuleTip,
				passwordStatus:0,
				comfirmPasswordTip:'',
				comfirmPasswordStatus:0
			});
			return;
		}else if(value.length < 8){
			this.setState({
				passwordTip:blogGlobal.passwordRuleErrLength,
				passwordStatus:1,
				comfirmPasswordTip:'',
				comfirmPasswordStatus:0
			});
			return;
		}else if(value.match(/^[0-9]+$/) || value.match(/^[a-zA-Z]+$/) || value.match(/^[_]+$/)){
			this.setState({
				passwordTip:blogGlobal.passwordRuleErrType,
				passwordStatus:1,
				comfirmPasswordTip:'',
				comfirmPasswordStatus:0
			});
			return;
		}
		this.setState({
			passwordTip:blogGlobal.rulePassTip,
			passwordStatus:2
		});
	}
	handlePasswordFocus = (event) => {
		if(this.state.password.trim() === ''){
			this.setState({
				passwordTip:blogGlobal.passwordRuleTip,
				passwordStatus:0
			});
		}
	}
	handlePasswordBlur = (event) => {
		if(this.state.password.trim() === ''){
			this.setState({
				passwordTip:blogGlobal.passwordNullTip,
				passwordStatus:1
			});
		}
	}
	handleComfirmPasswordChange = (event) => {
		this.setState({comfirmPassword:event.target.value});
	}
	handleComfirmPasswordFocus = (event) => {
		this.setState({comfirmPasswordStatus:0});
	}
	handleComfirmPasswordBlur = (event) => {
		let comfirmPassword = this.state.comfirmPassword;
		if(comfirmPassword.trim() === '' && this.state.passwordStatus === 2){
			this.setState({
				comfirmPasswordTip:blogGlobal.comfirmPasswordNullTip,
				comfirmPasswordStatus:1
			});
			return;
		}else if(comfirmPassword !== this.state.password && this.state.passwordStatus === 2){
			this.setState({
				comfirmPasswordTip:blogGlobal.comfirmPasswordErr,
				comfirmPasswordStatus:1
			});
			return;
		}
		this.setState({
			comfirmPasswordTip:'',
			comfirmPasswordStatus:2
		});
	}

	handleEmailChange = (event) => {
		this.setState({email:event.target.value});
	}
	handleEmailFocus = (event) => {
		this.setState({emailStatus:0});
	}
	handleEmailBlur = (event) => {
		let email = this.state.email;
		if(email.trim() === ''){
			this.setState({
				emailTip:blogGlobal.emailNullTip,
				emailStatus:1
			});
			return;
		}else if(!email.match(/^([A-z0-9_\-\.])+@([A-z0-9_\-])+\.([A-z0-9]{2,4})+$/)){
			this.setState({
				emailTip:blogGlobal.emailRuleErrTip,
				emailStatus:1
			});
			return;
		}
		this.setState({
			emailTip:blogGlobal.rulePassTip,
			emailStatus:2
		});
	}

	handleSubmit = (event) => {
		event.preventDefault();
		if(this.state.username.trim() === ''){
			this.setState({
				usernameTip:blogGlobal.usernameNullTip,
				usernameStatus:1
			});
			return;
		}
		if(this.state.email.trim() === ''){
			this.setState({
				emailTip:blogGlobal.emailNullTip,
				emailStatus:1
			});
			return;
		}
		if(this.state.password.trim() === ''){
			this.setState({
				passwordTip:blogGlobal.passwordNullTip,
				passwordStatus:1
			});
			return;
		}
		if(this.state.comfirmPassword.trim() === ''){
			this.setState({
				comfirmPasswordTip:blogGlobal.comfirmPasswordNullTip,
				comfirmPasswordStatus:1
			});
			return;
		}
		if(this.state.usernameStatus!=2||this.state.passwordStatus!=2||this.state.comfirmPasswordStatus!=2||this.state.emailStatus!=2){
			return;
		}
		let data = {
			username:this.state.username,
			password:SHA(this.state.password),
			email:this.state.email
		}
		let url =blogGlobal.requestBaseUrl+"/register";
        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
    		'Content-Type': 'application/json'
          },
          mode:'cors',
          credentials: 'include',
          body: JSON.stringify(data)
        }).then((response) => {
                return response.json();
            }
        ).then(
            (json) => {
            	let status = json.status;
            	if(status === 0){
            		this.setState({dbStatus:1,dbTip:'用户名已存在'});
            		this.setState({usernameTip:blogGlobal.usernameRuleTip,usernameStatus:0},() => {
            			this.refs.inputUsername.value = '';
            			this.refs.inputUsername.focus();
            		});
            		this.setState({passwordTip:blogGlobal.passwordRuleTip,passwordStatus:0},() => {
            			this.refs.inputPassword.value = ''; 
            		});
            		this.refs.inputComfirm.value = ''; 
            	}else{
            		this.setState({dbStatus:2,dbTip:blogGlobal.registerPassTip});
            		setTimeout(() => this.props.history.push('/login'), 2000);
            	}
            }
        ).catch((err) => {
        	 console.log(err)
        })
    }

	render(){
		let usernameTipType = {
			0:'info',
			1:'error',
			2:'success'
		}[this.state.usernameStatus];
		let usernameTipText = this.state.usernameTip;
		let passwordTipType = {
			0:'info',
			1:'error',
			2:'success'
		}[this.state.passwordStatus];
		let passwordTipText = this.state.passwordTip;
		return(
			<div>
				<QuickLink pageName="register"/>
				<div className="form-box">
					<form onSubmit={this.handleSubmit}>
						<div className="form-group fa fa-user">
							<input type="text" name="username" ref="inputUsername" placeholder="用户名" onChange={this.handleUserNameChange} onFocus={this.handleUserNameFocus} onBlur={this.handleUserNameBlur}/>
							<TipBar type={usernameTipType} text={usernameTipText} arrow="has"/>
						</div>
						<div className="form-group fa fa-envelope">
							<input type="text" name="email" ref="inputEmail" placeholder="邮箱" onChange={this.handleEmailChange} onFocus={this.handleEmailFocus} onBlur={this.handleEmailBlur}/>
							{this.state.emailStatus == 0 ? '' : <TipBar type={this.state.emailStatus == 1 ? 'error' : 'success'} text={this.state.emailTip} arrow="has"/>}
						</div>
						<div className="form-group fa fa-lock">
							<input type="password" name="password" ref="inputPassword" placeholder="密码" onChange={this.handlePasswordChange} onFocus={this.handlePasswordFocus} onBlur={this.handlePasswordBlur}/>
							<TipBar type={passwordTipType} text={passwordTipText} arrow="has"/>
						</div>
						<div className="form-group fa fa-lock">
							<input type="password" name="password" ref="inputComfirm" placeholder="确认密码" onChange={this.handleComfirmPasswordChange} onFocus={this.handleComfirmPasswordFocus} onBlur={this.handleComfirmPasswordBlur}/>
							{this.state.comfirmPasswordStatus != 1 ? '' : <TipBar type="error" text={this.state.comfirmPasswordTip} arrow="has"/>}
						</div>
					 	<TipBar type={this.state.dbStatus == 1 ? 'error' : 'success'} text={this.state.dbTip} arrow="no" classNames={this.state.dbStatus == 0 ? 'unvisible':'visible'}/>
						<button className="operate-btn" name="login-btn">注册</button>
					</form>
				</div>
			</div>
		)
	}
}


export default CSSModules(Register, style,{handleNotFoundStyleName:'log'});
// export default Register;
