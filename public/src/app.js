import React from 'react';
import {Route,Switch} from 'react-router-dom';
import blogGlobal from './data/global';
import Header from './component/header/header';
import Home from './pages/home';
import Article from './pages/article';
import Tag from './pages/tag';
import Archive from './pages/archive';
import About from './pages/about';
import Login from './pages/login.js';
import Register from './pages/register.js';
import User from './pages/user.js';
import Draft from './pages/draft.js';
import NoMatch from './pages/nomatch.js';

import 'es5-shim';
//为当前环境提供一个垫片babel-polyfill,来转换JavaScript新的API
import 'babel-polyfill';

import './sass/main.scss'

export default class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			isLogin:true,
			username:'',
			role:0
		}
	}
	componentWillMount = () => {
		let url = blogGlobal.requestBaseUrl;
		fetch(url,{
			method:'GET',
			mode:'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json,json.isLogin)
			this.setState({isLogin:json.isLogin});
			if(json.username){
				this.setState({username:json.username,role:json.role});
				sessionStorage.setItem('username',json.username);
			}
			sessionStorage.setItem('isLogin',json.isLogin);

		}).catch((err) => {
			console.log(err)
		})
	}

	handleLogout = () => {
		let url = blogGlobal.requestBaseUrl+'/logout';
		fetch(url,{
			method:'GET',
			mode:'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
			this.setState({isLogin:false,role:0});
			sessionStorage.setItem('isLogin',false);
			sessionStorage.removeItem('username');
			sessionStorage.removeItem('loginTipClose');
		}).catch((err) => {
			console.log(err)
		})
	}

	render(){
		let {isLogin,username,role} = this.state;
		let headerProps = {
			isLogin:isLogin,
			username:username,
			role:role
		}
		return(
			<div id="root">
				<Header {...headerProps} handleLogout={this.handleLogout}/>
				<main className="main-content">
					<Switch>
				    	<Route exact path='/' component={(props) => <Home {...props} isLogin={isLogin}/>}/>
						<Route path="/tag" component={Tag}/>
						<Route path="/archive" component={Archive}/>
						<Route path="/about" component={About}/>
						<Route path="/login" component={Login}/>
						<Route path="/register" component={Register}/>
						<Route path="/user" component={User}/>
						<Route path="/article" component={Article}/>
						<Route path="/draft" component={Draft}/>
						<Route component={NoMatch}/>
				    </Switch>
				</main>
			</div>
		)
	}
}
