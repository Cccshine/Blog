import React from 'react';
import {Link} from 'react-router-dom';
import QuickLink from '../component/quickLink/quick-link';
import FormBox from '../component/FormBox/form-box';


export default class Login extends React.Component{
	constructor(props){
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
	}
	handleLogin(e){
		
		this.props.history.push('/');
	}
	render(){
		return(
			<div>
				<QuickLink />
				<FormBox />
			</div>
		)
	}
}