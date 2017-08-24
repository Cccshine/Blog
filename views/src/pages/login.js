import React from 'react';
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
			this.setState({info:'用户名不能为空',status:1});
			return;
		}else if(userName !== 'cc'){
			this.setState({info:'用户名不存在',status:1});
			return;
		}else if(password === ''){
			this.setState({info:'密码不能为空',status:1});
			return;
		}else if(userName !== 'cc' || password !== 'cong770823'){
			this.setState({info:'用户名与账号不匹配',status:1});
			return;
		}
		this.setState({info:'登录成功',status:2});
		this.props.history.push('/');
	}
	render(){
		return(
			<div>
				<QuickLink pageName="login"/>
				<div className="form-box">
					<form onSubmit={this.handleSubmit}>
						<div className="form-group fa fa-user">
							<input type="text" name="username" placeholder="用户名" onChange={this.handleUserNameChange}/>
						</div>
						<div className="form-group fa fa-lock">
							<input type="password" name="password" placeholder="密码" onChange={this.handlePasswordChange}/>
						</div>
						{this.state.status != 1 ? '' : <TipBar type="error" text={this.state.info} arrow="no"/>}
						<button className="operate-btn" name="login-btn">登录</button>
					</form>
				</div>
			</div>
		)
	}
}

export default CSSModules(Login, style,{handleNotFoundStyleName:'log'});
// export default Login;
