import React from 'react';
import SHA from 'sha1';
import { Link } from 'react-router-dom';
import blogGlobal from '../data/global';
import QuickLink from '../component/quickLink/quick-link';
import TipBar from '../component/tipBar/tip-bar';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/forget.scss';
import '../sass/global/_form-box.scss';


class Forget extends React.Component{
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
	render(){
		let {status,info,autoLogin} = this.state;
		let tipbarProps = {
			type:status == 1 ? 'error' : 'success',
			text:info,
			arrow:'no',
			classNames:status == 0 ? 'unvisible':'visible'
		}
		let usernameTipType = 'info'
		let usernameTipText = 'info'
		return(
			<div styleName="root">
				<QuickLink pageName="login"/>
				<div styleName="main-content">
					<h3>找回密码</h3>
					<ul styleName="step-list">
						<li styleName="active"><i>1</i>确认账号</li>
						<li><i>2</i>安全验证</li>
						<li><i>3</i>重置密码</li>
					</ul>
					<div className="form-box" styleName="form-box-spc">
						<form onSubmit={this.handleSubmit}>
							<div className="form-group">
								<input type="text" name="username" placeholder="用户名/邮箱名" onChange={this.handleUserNameChange}/>
								<TipBar type={usernameTipType} text={usernameTipText} arrow="has"/>
							</div>
							<button className="operate-btn">下一步</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}
// https://www.v2ex.com/t/303642?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io
export default CSSModules(Forget, style,{handleNotFoundStyleName:'log'});
