import React from 'react';
import SHA from 'sha1';
import { Link } from 'react-router-dom';
import blogGlobal from '../data/global';
import QuickLink from '../component/quickLink/quick-link';
import TipBar from '../component/tipBar/tip-bar';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/forget.scss';
import '../sass/global/_form-box.scss';


class Forget extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			step: 1,
			username: '',
			password:'',
		    comfirmPassword:'',
			status: 0,//0--未验证 1--错误;
			tip: '',
			email: '',
			emailStatus:0, //0--未发送/发送失败 1--发送成功,
			time: blogGlobal.tryTime,
			verifyCode: '',
			passwordTip:blogGlobal.passwordRuleTip,
		    comfirmPasswordTip:'',
		    passwordStatus:0,//0--提示 1--错误 2--通过
		    comfirmPasswordStatus:0,//0--正获得焦点 1--错误 2--通过
		};
	}
	handleUserNameChange = (event) => {
		this.setState({ username: event.target.value });
	}
	handleUserNameFocus = (event) => {
		if(this.state.status !== 0)
			this.setState({ status: 0 });
	}
	handleVerifyCodeChange = (event) => {
		this.setState({ verifyCode: event.target.value });
	}
	handleVerifyCodeFocus = (event) => {
		if(this.state.status !== 0)
			this.setState({ status: 0 });
	}
	handleSubmit = (event) => {
		event.preventDefault();
		let step = this.state.step;
		if(step === 1){
			let username = this.state.username;
			if (username === '') {
				this.setState({ tip: blogGlobal.usernameNullTip, status: 1 });
				return;
			}
			let data = {
				username: username,
			}
			let url = blogGlobal.requestBaseUrl + "/forget";
			this.sendRequest(url, 'post', data, (json) => {
				let {status, email} = json;
				if (status === 0) {
					this.setState({ tip: blogGlobal.usernameUnExist, status: 1 });
				} else {
					this.setState({ step: 2, email: email});
				}
			});
		}else if(step === 2){
			let {username, verifyCode}= this.state;
			if (verifyCode === '') {
				this.setState({ tip: '验证码不能为空', status: 1 });
				return;
			}
			let data = {
				username: username,
				verifyCode: verifyCode
			}
			let url = blogGlobal.requestBaseUrl + "/forget/verify";
			this.sendRequest(url, 'post', data, (json) => {
				let {status} = json;
				if (status === 0) {
					this.setState({ tip: '验证码已过期', status: 1 });
				} else if(status === 1){
					this.setState({ tip: '验证码不正确', status: 1 });
				} else {
					this.setState({ step: 3});
				}
			});
		}else if(step === 3){
			let {password, comfirmPassword, passwordStatus, comfirmPasswordStatus, username} = this.state;
			if(password.trim() === ''){
				this.setState({
					passwordTip:blogGlobal.passwordNullTip,
					passwordStatus:1
				});
				return;
			}
			if(comfirmPassword.trim() === ''){
				this.setState({
					comfirmPasswordTip:blogGlobal.comfirmPasswordNullTip,
					comfirmPasswordStatus:1
				});
				return;
			}
			if(passwordStatus != 2 || comfirmPasswordStatus != 2){
				return;
			}
			let data = {
				username:this.state.username,
				password:SHA(this.state.password)
			}
			let url = blogGlobal.requestBaseUrl + "/user/reset-password";
			this.sendRequest(url, 'post', data, (json) => {
				this.setState({ step: 4 });
			});
		}else{
			let {username, password} = this.state;
			let data = {
				username:username,
				password:password,
				isAuto:false
			}
			let url = blogGlobal.requestBaseUrl+"/login";
			this.sendRequest(url, 'post', data, (json) => {
				setTimeout(() => this.props.history.push({ pathname: '/', state: {isLogin:true} }), 2000);
			});
		}
	}

	sendVerify = (event) => {
		event.preventDefault();
		let {emailStatus, email, username} = this.state;
		if(emailStatus === 1){
			return;
		}
		let url = blogGlobal.requestBaseUrl + "/forget?toEmail="+email+"&username="+username;
		this.sendRequest(url, 'get', null, (json) => {
			let status = json.status;
			if (status === 0) {
				this.setState({ tip: '验证码发送失败，请重新发送', status: 1 });
			} else {
				this.setState({ emailStatus: 1 });
				this.countDown(this.state.time);
			}
		});
	}

	countDown = (count) => {
		let time = count;
		let timer = setInterval(()=>{
			this.setState({time:time});
			if(time <= 1){
				clearInterval(timer);
				this.setState({emailStatus:0, time: blogGlobal.tryTime});
			}
			time--;
		},1000)
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

	//发送请求
	sendRequest = (url, mode, data, callback) => {
		fetch(url, {
			method: mode,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			credentials: 'include',
			body: data ? JSON.stringify(data) : null
		}).then((response) => {
			return response.json();
		}).then((json) => {
			callback && callback(json);
		}).catch((err) => {
			console.log(err);
		});
	}

	render() {
		let { status, username, tip, step, email, emailStatus, time, passwordStatus, passwordTip, comfirmPasswordStatus, comfirmPasswordTip} = this.state;
		let passwordTipType = {
			0:'info',
			1:'error',
			2:'success'
		}[passwordStatus];
		return (
			<div styleName="root">
				<QuickLink pageName="index" />
				<div styleName="main-content">
					<h3>找回密码</h3>
					<ul styleName="step-list">
						<li styleName={step === 1 ? "active" : ""}><i>1</i>确认账号</li>
						<li styleName={step === 2 ? "active" : ""}><i>2</i>安全验证</li>
						<li styleName={step === 3 ? "active" : ""}><i>3</i>重置密码</li>
					</ul>
					{
						(() => {
							switch (step) {
								case 2:
									return (
										<div styleName="safe-verify">
											<p styleName="tip">为了您的账号安全，请通过密保邮箱<strong>{email}</strong>完成身份验证</p>
											<div className="form-box" styleName="form-box-spc">
												<form>
													<div className="form-group" styleName="form-group-double">
														<input type="text" name="verify" placeholder="邮箱验证码" onChange={this.handleVerifyCodeChange} onFocus={this.handleVerifyCodeFocus} />
														<button className="operate-btn" styleName={emailStatus === 1 ? "disabled-btn" : ""} onClick={this.sendVerify}>{emailStatus === 1 ? "重新发送(" + time + "s)": "发送验证码"}</button>
														{status == 0 ? null : <TipBar type='error' text={tip} arrow="has" />}
													</div>
													<button className="operate-btn" onClick={this.handleSubmit}>下一步</button>
												</form>
											</div>
										</div>
									)
									break;
								case 3:
									return (
										<div className="form-box" styleName="form-box-spc">
											<form>
												<div className="form-group">
													<input type="password" name="password" ref="inputPassword" placeholder="新密码" onChange={this.handlePasswordChange} onFocus={this.handlePasswordFocus} onBlur={this.handlePasswordBlur}/>
													<TipBar type={passwordTipType} text={passwordTip} arrow="has"/>
												</div>
												<div className="form-group">
													<input type="password" name="password" ref="inputComfirm" placeholder="确认密码" onChange={this.handleComfirmPasswordChange} onFocus={this.handleComfirmPasswordFocus} onBlur={this.handleComfirmPasswordBlur}/>
													{comfirmPasswordStatus != 1 ? null : <TipBar type="error" text={comfirmPasswordTip} arrow="has"/>}
												</div>
												<button className="operate-btn" onClick={this.handleSubmit}>确定</button>
											</form>
										</div>
									)
									break;
								case 4:
									return (
										<div styleName="complete">
											<p styleName="tip"><i className="fa fa-check-circle"></i> 恭喜，账号<strong>{username}</strong>重置密码成功</p>
											<button className="operate-btn" onClick={this.handleSubmit}>直接登录</button>
										</div>
									)
									break;
								default:
									return (
										<div className="form-box" styleName="form-box-spc">
											<form>
												<div className="form-group">
													<input type="text" name="username" placeholder="用户名" onChange={this.handleUserNameChange} onFocus={this.handleUserNameFocus} />
													{status == 0 ? null : <TipBar type='error' text={tip} arrow="has" />}
												</div>
												<button className="operate-btn" onClick={this.handleSubmit}>下一步</button>
											</form>
										</div>
									)
							}
						})()
					}
				</div>
			</div>
		)
	}
}


// https://www.v2ex.com/t/303642?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io
export default CSSModules(Forget, style, { handleNotFoundStyleName: 'log' });
