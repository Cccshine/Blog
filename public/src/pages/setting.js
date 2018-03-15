import React from 'react';
import SHA from 'sha1';
import moment from 'moment';
import Modal from '../component/modal/modal';
import TipBar from '../component/tipBar/tip-bar';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/setting.scss';
import blogGlobal from '../data/global';
import NoMatch from './nomatch.js';

class Setting extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			email: '',
			password:'',
			showTip: false,
			pwModalShow: false,
			comfirmPassword:'',
			passwordTip:blogGlobal.passwordRuleTip,
		    comfirmPasswordTip:'',
		    passwordStatus:0,//0--提示 1--错误 2--通过
		    comfirmPasswordStatus:0,//0--正获得焦点 1--错误 2--通过
		}
	}

	componentWillMount = () => {
		let url = blogGlobal.requestBaseUrl + "/user?username="+sessionStorage.getItem('username');
		this.sendRequest(url, 'get', null, (json) => {
			this.setState({email:json.userInfo.email})
		});
	}

	handleChangePw = (event) => {
		this.setState({pwModalShow:true});
	}

	handlePwModalClose = (event) => {
		this.setState({pwModalShow:false,password:'',comfirmPassword:'',passwordStatus:0,comfirmPasswordStatus:0,passwordTip:blogGlobal.passwordRuleTip,comfirmPasswordTip:''});
	}

	comfirmChangePw = () => {
		let {password, comfirmPassword, passwordStatus, comfirmPasswordStatus} = this.state;
		let username = sessionStorage.getItem('username');
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
			this.setState({pwModalShow:false,password:'',comfirmPassword:'',passwordStatus:0,comfirmPasswordStatus:0,passwordTip:blogGlobal.passwordRuleTip,comfirmPasswordTip:'',showTip:true});
			this.hideTip();
		});
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

	//发送请求mode: post--新建评论
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

	hideTip = () => {
		setTimeout(() => this.setState({ showTip: false }), 1000);
	}

	render(){
		let {email,pwModalShow,passwordStatus, passwordTip, comfirmPasswordStatus, comfirmPasswordTip, showTip} = this.state;
		let passwordTipType = {
			0:'info',
			1:'error',
			2:'success'
		}[passwordStatus];
		let pwModalHtml = <div className="form-box" styleName="form-box-spc">
							<form>
								<div className="form-group">
									<input type="password" name="password" ref="inputPassword" placeholder="新密码" onChange={this.handlePasswordChange} onFocus={this.handlePasswordFocus} onBlur={this.handlePasswordBlur}/>
									<TipBar type={passwordTipType} text={passwordTip} arrow="has"/>
								</div>
								<div className="form-group">
									<input type="password" name="password" ref="inputComfirm" placeholder="确认密码" onChange={this.handleComfirmPasswordChange} onFocus={this.handleComfirmPasswordFocus} onBlur={this.handleComfirmPasswordBlur}/>
									{comfirmPasswordStatus != 1 ? null : <TipBar type="error" text={comfirmPasswordTip} arrow="has"/>}
								</div>
							</form>
						</div>;
		let pwModalProps = {
			isOpen: pwModalShow,
			title: '修改密码',
			modalHtml: pwModalHtml,
			btns: [{ name: '确定', ref: 'ok', handleClick: this.comfirmChangePw }, { name: '取消', ref: 'close' }],
			handleModalClose: this.handlePwModalClose
		}
		let tipProps = {
			arrow: 'no',
			type: 'success',
			text: '修改成功',
			classNames: 'tip-bar-alert'
		}
		return(
			<div styleName="root">
				<ul styleName="setting-list">
					<li><i className="fa fa-key"></i><span styleName="operate-link-spc" onClick={this.handleChangePw}>修改</span>密码</li>
					<li><i className="fa fa-envelope-o"></i>密保邮箱：{email}<span styleName="operate-link" onClick={this.handleChangeEmail}>修改</span></li>
				</ul>
				{pwModalShow ? <Modal {...pwModalProps} /> : null}
				{showTip ? <TipBar {...tipProps} /> : null}
			</div>
		)
	}
}
export default CSSModules(Setting, style, { handleNotFoundStyleName: 'log' });