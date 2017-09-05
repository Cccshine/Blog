import React from 'react';
import ReactDOM from 'react-dom';
import {Route} from 'react-router-dom';
import blogGlobal from './data/global';
import Main from './component/main'
import Header from './component/header/header'

import 'es5-shim';
//为当前环境提供一个垫片babel-polyfill,来转换JavaScript新的API
import 'babel-polyfill';

import './sass/main.scss'

export default class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			isLogin:false,
			username:''
		}
	}
	componentDidMount = () => {
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
				this.setState({username:json.username});
				sessionStorage.setItem('username',json.username);
			}
			sessionStorage.setItem('isLogin',json.isLogin);

		}).catch((err) => {
			console.log(err)
		})
	}
	render(){
		return(
			<div>
				<Header  isLogin={this.state.isLogin} username={this.state.username}/>
				<Main isLogin={this.state.isLogin}/>
			</div>
		)
	}
}