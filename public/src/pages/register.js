import React from 'react';
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
		    comfirmPassword:'',
		    usernameTip:'只包含汉字、数字、字母、下划线其中一种或几种，长度不能超过10',
		    passwordTip:'必须包含数字、字母、下划线其中两种，长度不小于8',
		    comfirmPasswordTip:'',
		    usernameStatus:0,//0--提示 1--错误 2--通过
		    passwordStatus:0,//0--提示 1--错误 2--通过
		    comfirmPasswordStatus:0,//0--正获得焦点 1--错误 2--通过
		    dbStatus:0,//0--成功 1--用户已存在 
		    dbTip:''
		};
	}

	handleUserNameChange = (event) => {
		var value = event.target.value;
		this.setState({username:value});
		if(value === ''){
			this.setState({usernameTip:'只包含汉字、数字、字母、下划线其中一种或几种，长度不能超过10',usernameStatus:0});
			return;
		}else if(value.length > 10){
			this.setState({usernameTip:'用户名长度不能超过10个字符',usernameStatus:1});
			return;
		}else if(value.match(/[^a-zA-Z0-9_\u4e00-\u9fa5]+/)){//只含有汉字、数字、字母、下划线
			this.setState({usernameTip:'用户名只能含有汉字、数字、字母、下划线',usernameStatus:1});
			return;
		}else{
			this.setState({usernameTip:'符合规则',usernameStatus:2});
		}
	}
	handleUserNameFocus = (event) => {
		this.setState({usernameTip:'只包含汉字、数字、字母、下划线其中一种或几种，长度不能超过10',usernameStatus:0});
	}
	handleUserNameBlur = (event) => {
		let username = this.state.username;
		if(username.trim() === ''){
			this.setState({usernameTip:'请输入用户名',usernameStatus:1});
			return;
		}
	}
	handlePasswordChange = (event) => {
		var value = event.target.value;
		this.setState({password:value});
		if(value === ''){
			this.setState({passwordTip:'必须包含数字、字母、下划线其中两种，长度不小于8',passwordStatus:0});
			return;
		}else if(value.length < 8){
			this.setState({passwordTip:'密码长度不能少于8个字符',passwordStatus:1});
			return;
		}else if(value.match(/^[0-9]+$/) || value.match(/^[a-zA-Z]+$/) || value.match(/^[_]+$/)){
			this.setState({passwordTip:'密码必须包含数字、字母、下划线其中两种',passwordStatus:1});
			return;
		}else{
			this.setState({passwordTip:'符合规则',passwordStatus:2});
		}
	}
	handlePasswordFocus = (event) => {
		this.setState({passwordTip:'必须包含数字、字母、下划线其中两种，长度不小于8',passwordStatus:0});
	}
	handlePasswordBlur = (event) => {
		let password = this.state.password;
		if(password.trim() === ''){
			this.setState({passwordTip:'请输入密码',passwordStatus:1});
			return;
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
		if(comfirmPassword.trim() === ''){
			this.setState({comfirmPasswordTip:'请确认密码',comfirmPasswordStatus:1});
			return;
		}else if(this.state.comfirmPassword !== this.state.password){
			this.setState({comfirmPasswordTip:'两次输入密码不一致',comfirmPasswordStatus:1});
			return;
		}
		this.setState({comfirmPasswordTip:'',comfirmPasswordStatus:2});
	}
	handleSubmit = (event) => {
		event.preventDefault();
		if(this.state.usernameStatus!=2||this.state.passwordStatus!=2||this.state.comfirmPasswordStatus!=2){
			return;
		}
		let data = {
			username:this.state.username,
			password:this.state.password
		}
		let url = "http://localhost:4000/register";
        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
    		'Content-Type': 'application/json'
          },
          mode:'cors',
          body: JSON.stringify(data)
        }).then((response) => {
                return response.json();
            }
        ).then(
            (json) => {
            	var status = json.status;
            	if(status = 1){
            		this.setState({dbStatus:1,dbTip:'用户名已存在'});
            	}else{
            		this.setState({dbStatus:0,dbTip:'注册成功'});
            		setTimeout(() => this.props.history.push('/'), 2000);
            	}
            }
        ).catch(function(err){
        	 console.log(err)
        })
    }

	render(){
		var usernameTipType = {
			0:'info',
			1:'error',
			2:'success'
		}[this.state.usernameStatus];
		var usernameTipText = this.state.usernameTip;
		var passwordTipType = {
			0:'info',
			1:'error',
			2:'success'
		}[this.state.passwordStatus];
		var passwordTipText = this.state.passwordTip;
		return(
			<div>
				<QuickLink pageName="register"/>
				<div className="form-box">
					<form onSubmit={this.handleSubmit}>
						<div className="form-group fa fa-user">
							<input type="text" name="username" placeholder="用户名" onChange={this.handleUserNameChange} onFocus={this.handleUserNameFocus} onBlur={this.handleUserNameBlur}/>
							<TipBar type={usernameTipType} text={usernameTipText} arrow="has"/>
						</div>
						<div className="form-group fa fa-lock">
							<input type="password" name="password" placeholder="密码" onChange={this.handlePasswordChange} onFocus={this.handlePasswordFocus} onBlur={this.handlePasswordBlur}/>
							<TipBar type={passwordTipType} text={passwordTipText} arrow="has"/>
						</div>
						<div className="form-group fa fa-lock">
							<input type="password" name="password"  placeholder="确认密码" onChange={this.handleComfirmPasswordChange} onFocus={this.handleComfirmPasswordFocus} onBlur={this.handleComfirmPasswordBlur}/>
							{this.state.comfirmPasswordStatus != 1 ? '' : <TipBar type="error" text={this.state.comfirmPasswordTip} arrow="has"/>}
						</div>
					 	<TipBar type="error" text={this.state.dbTip} arrow="no" classNames={this.state.dbStatus == 0 ? 'unvisible':'visible'}/>
						<button className="operate-btn" name="login-btn">注册</button>
					</form>
				</div>
			</div>
		)
	}
}


export default CSSModules(Register, style,{handleNotFoundStyleName:'log'});
// export default Register;
