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
		    userName:'',
		    password:'',
		    comfirmPassword:'',
		    userNameTip:'只包含汉字、数字、字母、下划线其中一种或几种，长度不能超过10',
		    passwordTip:'必须包含数字、字母、下划线其中两种，长度不小于8',
		    comfirmPasswordTip:'',
		    userNameStatus:0,//0--提示 1--错误 2--通过
		    passwordStatus:0,//0--提示 1--错误 2--通过
		    comfirmPasswordStatus:0//0--正获得焦点 1--错误 2--通过
		};
	}

	handleUserNameChange = (event) => {
		var value = event.target.value;
		this.setState({userName:value});
		if(value === ''){
			this.setState({userNameTip:'只包含汉字、数字、字母、下划线其中一种或几种，长度不能超过10',userNameStatus:0});
			return;
		}else if(value.length > 10){
			this.setState({userNameTip:'用户名长度不能超过10个字符',userNameStatus:1});
			return;
		}else if(value.match(/[^a-zA-Z0-9_\u4e00-\u9fa5]+/)){//只含有汉字、数字、字母、下划线
			this.setState({userNameTip:'用户名只能含有汉字、数字、字母、下划线',userNameStatus:1});
			return;
		}else{
			this.setState({userNameTip:'符合规则',userNameStatus:2});
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
	handleComfirmPasswordChange = (event) => {
		this.setState({comfirmPassword:event.target.value});
	}
	handleComfirmPasswordFocus = (event) => {
		this.setState({comfirmPasswordStatus:0});
	}
	handleComfirmPasswordBlur = (event) => {
		if(this.state.comfirmPassword !== this.state.password){
			this.setState({comfirmPasswordTip:'两次输入密码不一致',comfirmPasswordStatus:1});
			return;
		}
		this.setState({comfirmPasswordTip:'',comfirmPasswordStatus:2});
	}
	handleSubmit = (event) => {
		event.preventDefault();

		let formData = new FormData();
        formData.append('userName', 'ccc');

		let url = "http://localhost:4000/register";
        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode:'no-cors',
          body: formData
        }).then(function(response){
        	console.log(response)
        }).then(function(err){
        	 console.log(err)
        })
    }

	render(){
		var userNameTipType = {
			0:'info',
			1:'error',
			2:'success'
		}[this.state.userNameStatus];
		var userNameTipText = this.state.userNameTip;
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
							<input type="text" name="username" placeholder="用户名" onChange={this.handleUserNameChange}/>
							<TipBar type={userNameTipType} text={userNameTipText} arrow="has"/>
						</div>
						<div className="form-group fa fa-lock">
							<input type="password" name="password" placeholder="密码" onChange={this.handlePasswordChange}/>
							<TipBar type={passwordTipType} text={passwordTipText} arrow="has"/>
						</div>
						<div className="form-group fa fa-lock">
							<input type="password" name="password"  placeholder="确认密码" onChange={this.handleComfirmPasswordChange} onFocus={this.handleComfirmPasswordFocus} onBlur={this.handleComfirmPasswordBlur}/>
							{this.state.comfirmPasswordStatus != 1 ? '' : <TipBar type="error" text={this.state.comfirmPasswordTip} arrow="has"/>}
						</div>
						<button className="operate-btn" name="login-btn">注册</button>
					</form>
				</div>
			</div>
		)
	}
}


export default CSSModules(Register, style,{handleNotFoundStyleName:'log'});
// export default Register;
