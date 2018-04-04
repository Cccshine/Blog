import React from 'react';
import {Route,Switch} from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';
import moment from 'moment';
import marked from 'marked';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/user.scss';
import blogGlobal from '../data/global';
import Activity from './user-activity.js';
import Collection from './user-collection.js';
import Praise from './user-praise.js';
import NoMatch from './nomatch.js';

import CImage from '../other/CImage.min.js';
import '../other/cimage.css';

let avatarFile = null;
let avatarArea = null;

let activeUsername = "";


class User extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			avatarModalShow:false,
			uploadSrc:'',
			avatarSrc:'',
		}
	}

	componentWillMount = () => {
		activeUsername = window.location.pathname.split('/', 3)[2];
		let url = blogGlobal.requestBaseUrl + "/user?username="+activeUsername;
		this.sendRequest(url, 'get', null, (json) => {
			this.setState({avatarSrc:json.userInfo.avatar});
			this.props.history.push({ pathname: '/user/'+activeUsername+'/activities'});
		});
	}

	handleChangeAvatar = (event) => {
		let file = event.target.files[0];
		if(file.type.split('/')[0] !== 'image'){
			alert('请上传图片');
			return;
		}
		if(file.size > 1024*1024*2){
			alert('图片大小不得超过2M');
			return;
		}
		avatarFile = file;
		let fd = new FileReader();
		fd.readAsDataURL(file);
		fd.onload = () => {
			this.setState({avatarModalShow:true,uploadSrc:fd.result});
			this.refs.upload.value = '';
			setTimeout(()=>{
				let CI = new CImage({
				    element: this.refs.cimage,
				    createHandles: ['n', 's', 'e', 'w', 'ne', 'se', 'sw', 'nw'],
				    aspectRatio: 1,
				    previewSize: [100, 50],
				    minSize: [20, 20],
				    onChange: () => {
				        avatarArea = CI.getSelectInfo();
				    }
				});
				CI.setSelect({x1:0,y1:0,x2:100,y2:100});
			}, 0);
		}
	}

	comfirmChangeAvatar = () => {
		let url = blogGlobal.requestBaseUrl + "/user/upload-avatar";
		var data = new FormData()
		data.append('avatar', avatarFile);
		data.append('avatarArea',JSON.stringify(avatarArea));
		fetch(url, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
			},
			mode: 'cors',
			credentials: 'include',
			body: data
		}).then((response) => {
			return response.json();
		}).then((json) => {
			this.setState({avatarSrc:json.avatarSrc});
		}).catch((err) => {
			console.log(err);
		});
		this.setState({avatarModalShow:false});
	}

	handleSetting = () => {
		this.props.history.push({ pathname: '/setting', state: {username:activeUsername}});
	}

	//发送请求
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


	render(){
		let {avatarModalShow,avatarSrc,uploadSrc} = this.state;
		let tagProps = { isLink: true, hasClose: false };
		let list = ["css","html"]
		let avatarModalHtml = <img id="cimage" ref="cimage" src={uploadSrc} alt={activeUsername}/>
		let avatarModalProps = {
			isOpen: avatarModalShow,
			title: '更换头像',
			name:'avatar',
			modalHtml: avatarModalHtml,
			btns: [{ name: '上传头像', ref: 'ok', handleClick: this.comfirmChangeAvatar }, { name: '取消', ref: 'close' }],
			handleModalClose: this.handleAvatarModalClose
		}
		return(
			<div styleName="root">
				<header className="clearfix" styleName="profile-header">
					<div className="fl" styleName="user-info">
						<div className="fl" styleName="avatar">
							<img className="fl" src={avatarSrc}  alt={activeUsername}/>
							{
								activeUsername === sessionStorage.getItem('username') ? <div><div styleName="mask"><span>更换头像</span></div><input type="file" name="avatar" ref="upload" title="请点击选择图片上传" accept="image/*" onChange={this.handleChangeAvatar}/></div> : null
							}
						</div>
						<h3 className="fl">{activeUsername}</h3>
					</div>
					{
						activeUsername === sessionStorage.getItem('username') ? <div className="fr" styleName="btn-group">
						<button className="btn-normal btn-md" onClick={this.handleSetting}>设置</button>
					</div> : null
					}
					
				</header>
				<div styleName="profile-main">
					<nav styleName="profile-tabs" className="profile-tabs">
						<NavLink to={"/user/"+activeUsername+"/activities"} activeClassName="active-tab">动态</NavLink>
						<NavLink to={"/user/"+activeUsername+"/collections"} activeClassName="active-tab">收藏的文章</NavLink>
						<NavLink to={"/user/"+activeUsername+"/praise"} activeClassName="active-tab">点赞的文章</NavLink>
					</nav>
					<div>
						<Switch>
							<Route path="/user/:username/collections" component={Collection}/>
							<Route path="/user/:username/praise" component={Praise}/>
							<Route path="/user/:username/activities" component={Activity}/>
							<Route component={NoMatch}/>
					    </Switch>
					</div>
				</div>
				{avatarModalShow ? <Modal {...avatarModalProps} /> : null}
			</div>
		)
	}
}
export default CSSModules(User, style, { handleNotFoundStyleName: 'log' });