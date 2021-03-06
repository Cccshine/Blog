import React from 'react';
import {Route,Switch} from 'react-router-dom';
import blogGlobal from './util/global';
import { sendRequest } from './util/util';
import Header from './component/header/header';
import Home from './pages/home';
import Write from './pages/write';
import Tag from './pages/tag';
import Archive from './pages/archive';
import About from './pages/about';
import User from './pages/user.js';
import Draft from './pages/draft.js';
import Article from './pages/article.js';
import Setting from './pages/setting.js';
import Message from './pages/message.js';
import NoMatch from './pages/nomatch.js';

import PubSub from 'pubsub-js';

import 'es5-shim';
//为当前环境提供一个垫片babel-polyfill,来转换JavaScript新的API
import 'babel-polyfill';

import './sass/main.scss';

export default class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			isLogin:true,
			username:'',
			avatar:'',
			role:0
		}
	}
	componentDidMount = () => {
		let url = blogGlobal.requestBaseUrl;
		sendRequest(url, 'get', null, (json) => {
			if(json.username){
				this.setState({isLogin:json.isLogin,username:json.username,avatar:json.avatar,role:json.role});
				sessionStorage.setItem('username',json.username);
				sessionStorage.setItem('role',json.role);
				sessionStorage.setItem('uid',json.uid);
			}else{
				this.setState({isLogin:json.isLogin});
			}
			sessionStorage.setItem('isLogin',json.isLogin);
		})
		this.pubsub_token = PubSub.subscribe('avtarChange', (topic,message) => {  
		    this.setState({  
		        avatar: message  
		    });  
		})
	}

	handleLogout = () => {
		let url = blogGlobal.requestBaseUrl+'/logout';
		sendRequest(url, 'get', null, (json) => {
			//console.log(json);
			this.setState({isLogin:false,role:0});
			sessionStorage.setItem('isLogin',false);
			sessionStorage.removeItem('username');
			sessionStorage.removeItem('role');
			sessionStorage.removeItem('uid');
			sessionStorage.removeItem('loginTipClose');
		})
	}

	componentWillUnmount(){  
	    PubSub.unsubscribe(this.pubsub_token);  
	} 

	render(){
		let {isLogin,username,avatar,role} = this.state;
		let userProps = {
			isLogin:isLogin,
			username:username,
			avatar:avatar,
			role:role
		}
		return(
			<div id="root">
				<Header {...userProps} handleLogout={this.handleLogout}/>
				<main className="main-content">
					<Switch>
				    	<Route exact path='/' component={(props) => <Home {...props} isLogin={isLogin} role={role}/>}/>
						<Route path="/tags/:tagName" component={(props) => <Tag {...props} role={role}/>}/>
						<Route path="/tags/" component={(props) => <Tag {...props} role={role}/>}/>
						<Route path="/archive/:time" component={(props) => <Archive {...props} role={role}/>}/>
						<Route path="/archive" component={(props) => <Archive {...props} role={role}/>}/>
						<Route path="/about" component={About}/>
						<Route path="/user/:username" component={User}/>
						<Route path="/write/:articleId" component={Write}/>
						<Route path="/write" component={Write}/>
						<Route path="/draft" component={Draft}/>
						<Route path="/articles/:articleId" component={Article}/>
						<Route path="/setting" component={Setting}/>
						<Route path="/message" component={Message}/>
						<Route component={NoMatch}/>
				    </Switch>
				</main>
			</div>
		)
	}
}
