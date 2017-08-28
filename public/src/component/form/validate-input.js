import React from 'react';
import TipBar from '../tipBar/tip-bar';
import CSSModules from 'react-css-modules';
import style from './validate-input.scss'

class ValidateInput extends React.Component{
	constructor(props) {
		super(props);
	    this.state = {
	    	inputValue:'',
	    	pass:false,
	    	tipInfo:'',
	    	errInfo:''
	    };
	}
	handleChange = (event) => {
			var value = event.target.value;
	}

	render(){
		var tipType = this.props.pass ?  'success' : (this.state.errInfo === '' ? 'info' : 'error');
		var tipText = this.props.pass ?  '符合规则' : (this.state.errInfo === '' ? this.state.tipInfo : this.state.errInfo);
		return (
			<div styleName="form-group" className="fa fa-user">
				<input type="text" placeholder={this.props.placeholder} onChange={this.handleChange}/>
				<TipBar type={tipType} text={tipText}/>
			</div>
		)
	}
}

export default CSSModules(ValidateInput, style,{handleNotFoundStyleName:'log'});
