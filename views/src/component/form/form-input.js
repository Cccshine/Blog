import React from 'react';
import CSSModules from 'react-css-modules';
import style from './form-box.scss'

class FormInput extends React.Component{
	constructor(props) {
		super(props);
	    this.state = {
	    	value:''
	    };
	    this.handleEmailChange = this.handleEmailChange.bind(this);
	    this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(event){
		event.preventDefault();
	}
	render(){
		return (
			<div styleName="form-group" className="fa fa-user">
				<input type="text" name="username" placeholder="用户名"/>
			</div>
		)
	}
}

export default CSSModules(FormBox, style,{handleNotFoundStyleName:'log'});
