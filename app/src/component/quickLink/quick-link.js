import React from 'react';
import {Link} from 'react-router-dom';
import CSSModules from 'react-css-modules';
import style from './quick-link.scss'

class QuickLink extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
		}
	}
	render(){
		return(
			<nav styleName="quick-link">
				{{
					'index':<div><Link to="/login" styleName="quick-link-item" data-role="index-quick-link">登录</Link><Link to="/register" styleName="quick-link-item" data-role="index-quick-link">注册</Link></div>,
					'login':<div><Link to="/" className="fa fa-home" styleName="quick-link-item">首页</Link><Link to="/register" className="fa fa-user-plus" styleName="quick-link-item">注册</Link></div>,
					'register':<div><Link to="/" className="fa fa-home" styleName="quick-link-item">首页</Link><Link to="/login" className="fa fa-user" styleName="quick-link-item">登录</Link></div>
				}[this.props.pageName]}
			</nav>
		)
	}
}

export default CSSModules(QuickLink,style,{handleNotFoundStyleName:'log'});