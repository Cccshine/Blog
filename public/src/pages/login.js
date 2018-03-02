import React from 'react';
import SHA from 'sha1';
import { Link } from 'react-router-dom';
import blogGlobal from '../data/global';
import QuickLink from '../component/quickLink/quick-link';
import TipBar from '../component/tipBar/tip-bar';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/login.scss';
import '../sass/global/_form-box.scss';


class Login extends React.Component{
	constructor(props){
		super(props);
		this.state = {
		    username:'',
		    password:'',
		    autoLogin:false,
		    info:'',
		    status:0//0--暂未输入 1--错误 2--通过
		};
	}
	handleUserNameChange = (event) => {
		this.setState({username:event.target.value});
	}
	handlePasswordChange = (event) => {
		this.setState({password:event.target.value});
	}
	handleAutoLoginClick = (event) => {
		this.setState({autoLogin:event.target.checked});
	}
	handleSubmit = (event) => {
		event.preventDefault();
		let username = this.state.username;
		let password = this.state.password;
		if(username === ''){
			this.setState({info:blogGlobal.usernameNullTip,status:1});
			return;
		}else if(password === ''){
			this.setState({info:blogGlobal.passowrdNullTip,status:1});
			return;
		}
		let data = {
			username:username,
			password:SHA(password),
			isAuto:this.state.autoLogin
		}
		let url = blogGlobal.requestBaseUrl+"/login";
		fetch(url,{
			method:'POST',
			headers:{
				'Accept':'application/json',
				'Content-Type':'application/json'
			},
			mode:'cors',
			credentials: 'include',
			body:JSON.stringify(data)
		}).then((response) => {
			return response.json();
		}).then((json) => {
			let status = json.status;
			if(status === 0){
				this.setState({info:blogGlobal.usernameUnExist,status:1});
			}else if(status === 1){
				this.setState({info:blogGlobal.passwordUnMatchTip,status:1});
			}else{
				this.setState({info:blogGlobal.loginPassTip,status:2});
				setTimeout(() => this.props.history.push({ pathname: '/', state: {isLogin:true} }), 2000);
			}
		}).catch(function(err){
        	 console.log(err)
        })

	}
	render(){
		let {status,info,autoLogin} = this.state;
		let tipbarProps = {
			type:status == 1 ? 'error' : 'success',
			text:info,
			arrow:'no',
			classNames:status == 0 ? 'unvisible':'visible'
		}
		return(
			<div styleName="root">
				<QuickLink pageName="login"/>
				<div className="form-box">
					<form onSubmit={this.handleSubmit}>
						<div className="form-group fa fa-user">
							<input type="text" name="username" placeholder="用户名/邮箱名" onChange={this.handleUserNameChange}/>
						</div>
						<div className="form-group fa fa-lock">
							<input type="password" name="password" placeholder="密码" onChange={this.handlePasswordChange}/>
						</div>
						<div className="form-group" styleName="auto-login">
							<label htmlFor="auto" styleName="auto-login-checkbox" className={"fa "+ (autoLogin ? "fa-check-square" : "fa-square-o")}></label>
							<input type="checkbox" id="auto" onClick={this.handleAutoLoginClick}/>
							<label htmlFor="auto">下次自动登录</label>
						</div>
						<TipBar {...tipbarProps}/>
						<button className="operate-btn" name="login-btn">登录</button>
						<Link to="/forget" styleName="quick-link-item">忘记密码？</Link>
					</form>
				</div>
			</div>
		)
	}
}

export default CSSModules(Login, style,{handleNotFoundStyleName:'log'});
// export default Login;
