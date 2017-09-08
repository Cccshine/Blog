import React from 'react';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import style from './modal.scss'

class Modal extends React.Component{
	constructor(props) {
		super(props);
	    this.state = {
	    	isOpen:props.isOpen
	    };
	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({isOpen:nextProps.isOpen});
	}

	handleClose = (event) => {
		console.log('bbb')
		this.setState({isOpen:false});
	}

	render(){
		let {title,modalHtml,btns,handleModalClose} = this.props;
		console.log(handleModalClose)
		return (
			<div>
				{this.state.isOpen ? 
					<div styleName="modal" ref="modal">
						<header styleName="modal-header">
							<h4>{title}</h4>
							<i className="fa fa-close" onClick={handleModalClose ? handleModalClose : this.handleClose}></i>
						</header>
						<main styleName="modal-body">
							{modalHtml}
						</main>
						<footer styleName="modal-footer">
							{
								btns.map((btn,index) => (
									<button className="btn-normal" key={index} onClick={btn.ref == 'close' ? (handleModalClose ? handleModalClose : this.handleClose) : btn.handleClick}>{btn.name}</button>
								))
							}
						</footer>
					</div> : null}
			</div>
		)
	}
}

export default CSSModules(Modal, style,{handleNotFoundStyleName:'log'});
