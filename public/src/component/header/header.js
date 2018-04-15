import React from 'react';
import blogGlobal from '../../data/global';
import {NavLink,Link} from 'react-router-dom';
import CSSModules from 'react-css-modules';
import QuickLink from '../quickLink/quick-link';
import ContactIcon from '../contactIcon/contact-icon';
import style from './header.scss';

  
let messageIds = [];
class Header extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			isLogin:props.isLogin,
			role:props.role,
			avatar:props.avatar,
			newMessageCount:0,
			messageList:[],
			messageStatus:0,
			msgShow:false
		}
	}

	componentDidMount = () => {
		console.log('this.props.username:'+sessionStorage.getItem('username'))
		const ws = new WebSocket('ws://localhost:4000/message?username='+sessionStorage.getItem('username'));
		document.addEventListener('click', this.hideMsgList, false);
		this.fetchNewMsgList();

		ws.onmessage= (e) => {  
			console.log('_message');  
			this.setState({newMessageCount:Number(e.data)});
			this.fetchNewMsgList();
		};  
		ws.onerror= (err) => {  
			console.log('_error');  
			console.log(err);  
		};  
		ws.onopen= () => {  
			ws.send(sessionStorage.getItem('username'));
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
	    document.removeEventListener('click', this.hideMsgList, false);
	    messageIds = null;
	} 

	fetchNewMsgList = () => {
		let url = blogGlobal.requestBaseUrl+'/message/unread';
		fetch(url,{
			method:'GET',
			mode:'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json)
			let status = json.messageList.length ? 1 : 2;
			messageIds = [];
			for(let item of json.messageList){
				messageIds.push(item._id);
			}
			this.setState({  
		        messageList: json.messageList,
		        messageStatus: status
		    });
		}).catch((err) => {
			console.log(err)
		})
	}

	toggleMsgList = (event) => {
		if(this.state.newMessageCount){
			this.setState({newMessageCount:0});
			let url = blogGlobal.requestBaseUrl+'/message/setRead?msgIds='+messageIds;
			fetch(url,{
				method:'GET',
				mode:'cors',
				credentials: 'include',
			}).then((response) => {
				return response.json();
			}).then((json) => {
				console.log(json)
			}).catch((err) => {
				console.log(err)
			})
		}
		this.setState({msgShow:!this.state.msgShow});
		event.nativeEvent.stopImmediatePropagation();
	}

	hideMsgList = (event) => {
		if(!this.state.msgShow){
			return;
		}
		this.setState({msgShow:false});
	}

	stopPropagation = (event) => {
		event.nativeEvent.stopImmediatePropagation();
	}


	render(){
		let {isLogin,role,avatar,msgShow,newMessageCount,messageList,messageStatus} = this.state;
		let quickLinkProps = {
			pageName:isLogin ? 'logined' : 'index',
			username:this.props.username,
			logout:this.props.handleLogout
		}
		return (
			<header styleName="top-header">
				<div styleName="logo" onClick={this.toggleMsgList}>
					<img src={avatar}  alt={this.props.username}/>
					{newMessageCount > 0 ? <span>{newMessageCount}</span> : null}
				</div>
				<div styleName="msg" style={{ display: msgShow ? 'block' : 'none' }} onClick={this.stopPropagation}>
					{
						(() => {
							switch (messageStatus) {
								case 1:
									return (
										<ul styleName="msg-list">
											{
												messageList.map((item, index) => {
													return(
														<li key={index}>
															<Link to={`/user/${item.operateUser.name}`}>{item.operateUser.name}</Link>
															{{
														        [1]: '收藏了你的文章',
														        [2]: '点赞了你的文章',
														        [3]: '评论了你的文章',
														        [4]: '点赞了你的评论',
														        [5]: '回复了你的评论',
														    }[item.messageMode]}
														    <Link to={`/articles/${item.article._id}`}>{item.messageMode > 3 ? item.comment.content : item.article.title}</Link>
													    </li>
													)
												})
											}
										</ul>
									)
									break;
								case 2:
									return <p styleName="null-tip">暂无提醒</p>
								default:
									return <div styleName="loading"><i className="fa fa-spinner fa-pulse"></i><span>正在加载...</span></div>
									break;
							}
						})()
					}
					<div styleName="msg-toolbar" style={{ display: messageStatus === 2 ? 'none' : 'block' }}>
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