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
			usernameStatus: 0,//0--未验证 1--错误
			usernameTipText: '',
		};
	}
	handleUserNameChange = (event) => {
		this.setState({ username: event.target.value });
	}
	handleUserNameFocus = (event) => {
		this.setState({ usernameStatus: 0 });
	}
	handleSubmit = (event) => {
		event.preventDefault();
		let username = this.state.username;
		if (username === '') {
			this.setState({ usernameTipText: blogGlobal.usernameNullTip, usernameStatus: 1 });
			return;
		}
		let data = {
			username: username,
		}
		let url = blogGlobal.requestBaseUrl + "/forget";
		fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			credentials: 'include',
			body: JSON.stringify(data)
		}).then((response) => {
			return response.json();
		}).then((json) => {
			let status = json.status;
			if (status === 0) {
				this.setState({ usernameTipText: blogGlobal.usernameUnExist, usernameStatus: 1 });
			} else {
				this.setState({ step: 2 });
			}
		}).catch(function (err) {
			console.log(err)
		})

	}
	render() {
		let { usernameStatus, usernameTipText, step } = this.state;
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
											<p styleName="tip">为了您的账号安全，请通过密保邮箱<strong>1071762488@qq.com</strong>完成身份验证</p>
											<div className="form-box" styleName="form-box-spc">
												<form onSubmit={this.handleSubmit}>
													<div className="form-group" styleName="form-group-double">
														<input type="text" name="verify" placeholder="邮箱验证码" onChange={this.handleVerifyChange} onFocus={this.handleVerifyFocus} />
														<button className="operate-btn">发送验证码</button>
													</div>
													<button className="operate-btn">下一步</button>
												</form>
											</div>
										</div>
									)
									break;
								default:
									return (
										<div className="form-box" styleName="form-box-spc">
											<form onSubmit={this.handleSubmit}>
												<div className="form-group">
													<input type="text" name="username" placeholder="用户名/邮箱名" onChange={this.handleUserNameChange} onFocus={this.handleUserNameFocus} />
													{usernameStatus == 0 ? null : <TipBar type='error' text={usernameTipText} arrow="has" />}
												</div>
												<button className="operate-btn">下一步</button>
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
