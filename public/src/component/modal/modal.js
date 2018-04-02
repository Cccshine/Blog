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
		this.setState({isOpen:false});
	}

	render(){
		let {title,name,modalHtml,btns,handleModalClose} = this.props;
		return (
			<div>
				{this.state.isOpen ? 
					<div styleName="modal" ref="modal" data-role={"model-"+name}>
						<header styleName="modal-header">
							<h4>{title}</h4>
							<i className="fa fa-close" onClick={handleModalClose ? handleModalClose : this.handleClose}></i>
						</header>
						<main styleName="modal-body" className="clearfix">
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
				{this.state.isOpen ? <div styleName="backdrop"></div> : null}
			</div>
		)
	}
}

export default CSSModules(Modal, style,{handleNotFoundStyleName:'log'});
