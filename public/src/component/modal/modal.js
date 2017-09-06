import React from 'react';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import style from './modal.scss'

class Modal extends React.Component{
	constructor(props) {
		super(props);
	    this.state = {
	    	isOpen:!sessionStorage.getItem('loginTipClose') 
	    };
	}

	handleClose = (event) => {
		this.setState({isOpen:false});
		sessionStorage.setItem('loginTipClose',true);
	}

	render(){
		let {title,modalHtml,btns} = this.props;
		return (
			<div>
				{this.state.isOpen ? 
					<div styleName="modal" ref="modal">
						<header styleName="modal-header">
							<h4>{title}</h4>
							<i className="fa fa-close" onClick={this.handleClose}></i>
						</header>
						<main styleName="modal-body">
							{modalHtml}
						</main>
						<footer styleName="modal-footer">
							{
								btns.map((btn,index) => (
									<button key={index} onClick={btn.ref == 'close' ? this.handleClose : btn.handleClick}>{btn.name}</button>
								))
							}
						</footer>
					</div> : null}
			</div>
		)
	}
}

export default CSSModules(Modal, style,{handleNotFoundStyleName:'log'});
