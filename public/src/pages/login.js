import React from 'react';
import SHA from 'sha1';
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
		    userName:'',
		    password:'',
		    info:'',
		    status:0//0--暂未输入 1--错误 2--通过
		};
	}
	handleUserNameChange = (event) => {
		this.setState({userName:event.target.value});
	}
	handlePasswordChange = (event) => {
		this.setState({password:event.target.value});
	}
	handleSubmit = (event) => {
		event.preventDefault();
		let userName = this.state.userName;
		let password = this.state.password;
		if(userName === ''){
			this.setState({info:blogGlobal.usernameNullTip,status:1});
			return;
		}else if(password === ''){
			this.setState({info:blogGlobal.passowrdNullTip,status:1});
			return;
		}
		let data = {
			username:userName,
			password:SHA(password)
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
				document.cookie = 'cc=1;max-age=3600'
				setTimeout(() => this.props.history.push('/'), 2000);
			}
		}).catch(function(err){
        	 console.log(err)
        })

	}
	render(){
		return(
			<div>
				<QuickLink pageName="login"/>
				<div className="form-box">
					<form onSubmit={this.handleSubmit}>
						<div className="form-group fa fa-user">
							<input type="text" name="username" placeholder="用户名/邮箱名" onChange={this.handleUserNameChange}/>
						</div>
						<div className="form-group fa fa-lock">
							<input type="password" name="password" placeholder="密码" onChange={this.handlePasswordChange}/>
						</div>
						<TipBar type={this.state.status == 1 ? 'error' : 'success'} text={this.state.info} arrow="no" classNames={this.state.status == 0 ? 'unvisible':'visible'}/>
						<button className="operate-btn" name="login-btn">登录</button>
					</form>
				</div>
			</div>
		)
	}
}

export default CSSModules(Login, style,{handleNotFoundStyleName:'log'});
// export default Login;
