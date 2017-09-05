import React from 'react';
import CSSModules from 'react-css-modules';
import style from './modal.scss'

class Modal extends React.Component{
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
		return (
			<div styleName="modal">
				<header styleName="modal-header">
					<h4>{this.props.title}</h4>
					<i className="fa fa-close"></i>
				</header>
				<main styleName="modal-body">
					{this.props.modalHtml}
				</main>
				<footer styleName="modal-footer">
					<button>确定</button>
					<button>取消</button>
				</footer>
			</div>
		)
	}
}

export default CSSModules(Modal, style,{handleNotFoundStyleName:'log'});
