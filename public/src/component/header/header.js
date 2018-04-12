import React from 'react';
import blogGlobal from '../../data/global';
import {NavLink,Link} from 'react-router-dom';
import CSSModules from 'react-css-modules';
import QuickLink from '../quickLink/quick-link';
import ContactIcon from '../contactIcon/contact-icon';
import style from './header.scss';
import PubSub from 'pubsub-js';

const ws = new WebSocket('ws://localhost:4000/ws');  

class Header extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			isLogin:props.isLogin,
			role:props.role,
			avatar:props.avatar,
			msgShow:false
		}
	}

	componentDidMount = () => {
		this.pubsub_token = PubSub.subscribe('avtarChange', (topic,message) => {  
		    this.setState({  
		        avatar: message  
		    });  
		})

	  ws.onmessage= (e) => {  
	    console.log('_message');  
	    console.log(e.data);  
	  };  
	  ws.onerror= (err) => {  
	    console.log('_error');  
	    console.log(err);  
	  };  
	  ws.onopen= () => {  
	  	ws.send('data');
	    console.log('_connect')  
	  };  
	  ws.onclose= () => {  
	    console.log('_close');  
	  };  
	  
	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({isLogin:nextProps.isLogin,avatar:nextProps.avatar,role:nextProps.role});
	}

	componentWillUnmount(){  
	    PubSub.unsubscribe(this.pubsub_token);  
	} 

	toggleMsgList = (event) => {
		this.setState({msgShow:!this.state.msgShow});
	}


	render(){
		let {isLogin,role,avatar,msgShow} = this.state;
		let quickLinkProps = {
			pageName:isLogin ? 'logined' : 'index',
			username:this.props.username,
			logout:this.props.handleLogout
		}
		return (
			<header styleName="top-header">
				<div styleName="logo" onClick={this.toggleMsgList}>
					<img src={avatar}  alt={this.props.username}/>
					<span>10</span>
				</div>
				<div styleName="msg" style={{ display: msgShow ? 'block' : 'none' }}>
					<ul styleName="msg-list">
						<li><Link to="/">cc</Link>评论了文章<Link to="/">测试测试timetotal</Link></li>
						<li><Link to="/">cc</Link>评论了文章<Link to="/">测试测试timetotal</Link></li>
						<li><Link to="/">cc</Link>评论了文章<Link to="/">测试测试timetotal</Link></li>
						<li><Link to="/">cc</Link>评论了文章<Link to="/">测试测试timetotal</Link></li>
						<li><Link to="/">cc</Link>评论了文章<Link to="/">测试测试timetotal</Link></li>
						<li><Link to="/">cc</Link>评论了文章<Link to="/">测试测试timetotal</Link></li>
					</ul>
					<div styleName="msg-toolbar">
						<Link to="/">查看全部>></Link>
					</div>
				</div>
				<nav styleName="header-nav">
					<NavLink exact to='/' activeClassName="active-nav">首页</NavLink>
					<NavLink to="/tags" activeClassName="active-nav">标签</NavLink>
					<NavLink to="/archive" activeClassName="active-nav">归档</NavLink>
					<NavLink to="/about" activeClassName="active-nav">About Me</NavLink>
					{role == 1 ? <NavLink to="/write" activeClassName="active-nav">写文章</NavLink> : null}
					{role == 1 ? <NavLink to="/draft" activeClassName="active-nav">草稿箱</NavLink> : null}
				</nav>
				<QuickLink {...quickLinkProps}/>
				<ContactIcon />
			</header>
		)
	}
}

export default CSSModules(Header, style,{handleNotFoundStyleName:'log'});