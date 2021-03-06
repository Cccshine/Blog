import React from 'react';
import SHA from 'sha1';
import Modal from '../component/modal/modal';
import TipBar from '../component/tipBar/tip-bar';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/setting.scss';
import blogGlobal from '../util/global';
import { 
	sendRequest,
	hideTip,
	handlePasswordChange,
	handlePasswordFocus,
	handlePasswordBlur,
	handleComfirmPasswordChange,
	handleComfirmPasswordFocus,
	handleComfirmPasswordBlur 
} from '../util/util';

class Setting extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			resetEmail: '',
			password: '',
			showTip: false,
			pwModalShow: false,
			emailModalShow: false,
			comfirmPassword: '',
			passwordTip: blogGlobal.passwordRuleTip,
			comfirmPasswordTip: '',
			passwordStatus: 0, //0--提示 1--错误 2--通过
			comfirmPasswordStatus: 0, //0--正获得焦点 1--错误 2--通过
			resetEmailStatus: 0,
			resetEmailTip: '',
			verifyEmailStatus: 0, //0--未发送/发送失败 1--发送成功,
			time: blogGlobal.tryTime,
			verifyCode: '',
			resetEmailStep: 1,
		}
		this.timer = null;
		this.mounted = true;
	}

	componentWillMount = () => {
		this.mounted = true;
		let url = blogGlobal.requestBaseUrl + "/user?username="+sessionStorage.getItem('username');
		sendRequest(url, 'get', null, (json) => {
			if(!this.mounted){
				return;
			}
			this.setState({
				email: json.userInfo.email
			})
		});
	}

	componentWillUnmount = () => {
		this.mounted = false;
	}

	handleChangePw = (event) => {
		this.setState({
			pwModalShow: true
		});
	}

	handlePwModalClose = (event) => {
		this.setState({
			pwModalShow: false,
			password: '',
			comfirmPassword: '',
			passwordStatus: 0,
			comfirmPasswordStatus: 0,
			passwordTip: blogGlobal.passwordRuleTip,
			comfirmPasswordTip: ''
		});
	}

	handleChangeEmail = (event) => {
		this.setState({
			emailModalShow: true
		});
	}

	handleEmailModalClose = (event) => {
		this.setState({
			emailModalShow: false,
			verifyCode: '',
			verifyEmailStatus: 0,
			resetEmailStatus: 0,
			resetEmailTip: '',
			resetEmail: '',
			resetEmailStep: 1
		});
	}

	comfirmChangePw = () => {
		let {
			password,
			comfirmPassword,
			passwordStatus,
			comfirmPasswordStatus
		} = this.state;
		let username = sessionStorage.getItem('username');
		if (password.trim() === '') {
			this.setState({
				passwordTip: blogGlobal.passwordNullTip,
				passwordStatus: 1
			});
			return;
		}
		if (comfirmPassword.trim() === '') {
			this.setState({
				comfirmPasswordTip: blogGlobal.comfirmPasswordNullTip,
				comfirmPasswordStatus: 1
			});
			return;
		}
		if (passwordStatus != 2 || comfirmPasswordStatus != 2) {
			return;
		}
		let data = {
			username: username,
			password: SHA(this.state.password)
		}
		let url = blogGlobal.requestBaseUrl + "/user/reset-password";
		sendRequest(url, 'post', data, (json) => {
			this.setState({
				pwModalShow: false,
				password: '',
				comfirmPassword: '',
				passwordStatus: 0,
				comfirmPasswordStatus: 0,
				passwordTip: blogGlobal.passwordRuleTip,
				comfirmPasswordTip: '',
				showTip: true
			});
			hideTip.call(this);
			setTimeout(() => this.props.history.push('/login'), 2000);
		});
	}

	handleVerifyCodeChange = (event) => {
		this.setState({
			verifyCode: event.target.value
		});
	}
	handleVerifyCodeFocus = (event) => {
		if (this.state.resetEmailStatus !== 0)
			this.setState({
				resetEmailStatus: 0
			});
	}

	sendVerify = (event) => {
		event.preventDefault();
		let {verifyEmailStatus,email} = this.state;
		let username = sessionStorage.getItem('username');
		if (verifyEmailStatus === 1) {
			return;
		}
		let url = blogGlobal.requestBaseUrl + "/forget?toEmail=" + email + "&username=" + username;
		sendRequest(url, 'get', null, (json) => {
			let status = json.status;
			if (status === 0) {
				this.setState({
					resetEmailTip: '验证码发送失败，请重新发送',
					resetEmailStatus: 1
				});
			} else {
				this.setState({
					verifyEmailStatus: 1
				});
				this.countDown(this.state.time);
			}
		});
	}

	verifyEmailCode = () => {
		let {
			verifyCode
		} = this.state;
		let username = sessionStorage.getItem('username');
		if (verifyCode === '') {
			this.setState({
				resetEmailTip: '验证码不能为空',
				resetEmailStatus: 1
			});
			return;
		}
		let data = {
			username: username,
			verifyCode: verifyCode
		}
		let url = blogGlobal.requestBaseUrl + "/forget/verify";
		sendRequest(url, 'post', data, (json) => {
			let {
				status
			} = json;
			//console.log(json)
			if (status === 0) {
				this.setState({
					resetEmailTip: '验证码已过期',
					resetEmailStatus: 1
				});
			} else if (status === 1) {
				this.setState({
					resetEmailTip: '验证码不正确',
					resetEmailStatus: 1
				});
			} else {
				this.setState({
					resetEmailStep: 2
				});
				clearInterval(this.timer);
			}
		});
	}

	countDown = (count) => {
		let time = count;
		this.timer = setInterval(() => {
			this.setState({
				time: time
			});
			if (time <= 1) {
				clearInterval(this.timer);
				this.setState({
					verifyEmailStatus: 0,
					time: blogGlobal.tryTime
				});
			}
			time--;
		}, 1000)
	}

	handleResetEmailChange = (event) => {
		this.setState({
			resetEmail: event.target.value
		});
	}
	handleResetEmailFocus = (event) => {
		this.setState({
			resetEmailStatus: 0
		});
	}
	handleResetEmailBlur = (event) => {
		let resetEmail = this.state.resetEmail;
		if (resetEmail.trim() === '') {
			this.setState({
				resetEmailTip: blogGlobal.emailNullTip,
				resetEmailStatus: 1
			});
			return;
		} else if (!resetEmail.match(/^([A-z0-9_\-\.])+@([A-z0-9_\-])+\.([A-z0-9]{2,4})+$/)) {
			this.setState({
				resetEmailTip: blogGlobal.emailRuleErrTip,
				resetEmailStatus: 1
			});
			return;
		}
		this.setState({
			resetEmailTip: blogGlobal.rulePassTip,
			resetEmailStatus: 2
		});
	}

	comfirmChangeEmail = () => {
		let {
			resetEmail,
			resetEmailStatus
		} = this.state;
		let username = sessionStorage.getItem('username');
		if (resetEmail.trim() === '') {
			this.setState({
				resetEmailTip: '邮箱不能为空',
				resetEmailStatus: 1
			});
			return;
		}
		if (resetEmailStatus != 2) {
			return;
		}
		let data = {
			username: username,
			email: resetEmail
		}
		let url = blogGlobal.requestBaseUrl + "/user/edit-email";
		sendRequest(url, 'post', data, (json) => {
			this.setState({
				email: resetEmail,
				emailModalShow: false,
				verifyCode: '',
				verifyEmailStatus: 0,
				resetEmailStatus: 0,
				resetEmailTip: '',
				resetEmail: '',
				resetEmailStep: 1,
				showTip: true
			});
			hideTip.call(this);
		});

	}


	render() {
		let {email,pwModalShow,emailModalShow,passwordStatus,passwordTip,comfirmPasswordStatus,comfirmPasswordTip,resetEmailStatus,resetEmailTip,verifyEmailStatus,resetEmailStep,showTip,time} = this.state;
		let passwordTipType = {
			0: 'info',
			1: 'error',
			2: 'success'
		}[passwordStatus];
		let pwModalHtml = <div className = "form-box" styleName = "form-box-spc">
							<form>
								<div className = "form-group" >
									<input type = "password" name = "password" ref = "inputPassword" placeholder = "新密码" onChange = {handlePasswordChange.bind(this)} onFocus = {handlePasswordFocus.bind(this)} onBlur = {handlePasswordBlur.bind(this)}/> 
									<TipBar type = {passwordTipType} text = {passwordTip} arrow = "has" />
								</div>
								<div className = "form-group">
									<input type = "password" name = "password" ref = "inputComfirm" placeholder = "确认密码" onChange = {handleComfirmPasswordChange.bind(this)} onFocus = {handleComfirmPasswordFocus.bind(this)} onBlur = {handleComfirmPasswordBlur.bind(this)}/> 
									{
										comfirmPasswordStatus != 1 ? null : < TipBar type = "error" text = {comfirmPasswordTip} arrow = "has" />
									} 
								</div>
							</form> 
						</div>;
		let pwModalProps = {
			isOpen: pwModalShow,
			title: '修改密码',
			modalHtml: pwModalHtml,
			btns: [{
				name: '确定',
				ref: 'ok',
				handleClick: this.comfirmChangePw
			}, {
				name: '取消',
				ref: 'close'
			}],
			handleModalClose: this.handlePwModalClose
		}
		let emailModalHtmlStep1 = <div styleName = "safe-verify">
									<p styleName = "tip" > 为了您的账号安全， 请通过密保邮箱 < br/><strong>{email}</strong>完成身份验证</p >
									<div className = "form-box" styleName = "form-box-spc">
										<form>
											<div className = "form-group" styleName = "form-group-double">
												<input type = "text" name = "verify" placeholder = "邮箱验证码" onChange = {this.handleVerifyCodeChange} onFocus = {this.handleVerifyCodeFocus}/> 
												<button className = "operate-btn" styleName = {verifyEmailStatus === 1 ? "disabled-btn" : ""} onClick = {this.sendVerify}> 
												{
													verifyEmailStatus === 1 ? "重新发送(" + time + "s)" : "发送验证码"
												} 
												</button> 
												{
													resetEmailStatus == 0 ? null : < TipBar type = 'error' text = {resetEmailTip} arrow = "has" />
												} 
											</div> 
										</form>
									</div> 
								</div>;
		let emailModalHtmlStep2 = <div className = "form-box" styleName = "form-box-spc">
									<form >
										<div className = "form-group" >
											<input type = "text" ref = "resetEmail" placeholder = "新邮箱" onChange = {this.handleResetEmailChange} onFocus = {this.handleResetEmailFocus} onBlur = {this.handleResetEmailBlur}/> 
											{
												resetEmailStatus == 0 ? null : < TipBar type = {resetEmailStatus == 1 ? 'error' : 'success'} text = {resetEmailTip} arrow = "has" />
											}
										</div> 
									</form>
								</div>;
		let emailModalProps = {
			isOpen: emailModalShow,
			title: '修改密保邮箱',
			modalHtml: resetEmailStep == 1 ? emailModalHtmlStep1 : emailModalHtmlStep2,
			btns: [{
				name: '确定',
				ref: 'ok',
				handleClick: resetEmailStep == 1 ? this.verifyEmailCode : this.comfirmChangeEmail
			}, {
				name: '取消',
				ref: 'close'
			}],
			handleModalClose: this.handleEmailModalClose
		}

		let tipProps = {
			arrow: 'no',
			type: 'success',
			text: '修改成功',
			classNames: 'tip-bar-alert'
		}
		return ( 
			<div styleName = "root" >
				<ul styleName = "setting-list" >
					<li> <i className = "fa fa-key"> </i><span styleName="operate-link-spc" onClick={this.handleChangePw}>修改</span > 密码 </li> 
					<li> <i className = "fa fa-envelope-o"> </i>密保邮箱：{email}<span styleName="operate-link" onClick={this.handleChangeEmail}>修改</span> </li> 
				</ul> 
				{pwModalShow ? < Modal { ...pwModalProps}/> : null} 
				{emailModalShow ? < Modal { ...emailModalProps}/> : null} 
				{showTip ? < TipBar { ...tipProps}/> : null} 
			</div>
		)
	}
}

export default CSSModules(Setting, style, {handleNotFoundStyleName: 'log'});