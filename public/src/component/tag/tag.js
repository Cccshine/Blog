import React from 'react';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import style from './tag.scss'

class Tag extends React.Component{
	constructor(props) {
		super(props);
	}

	handleClose = () => {
		
	}
	render(){
		let {content,hasClose} = this.props;
		return (
			<div styleName="tag">
				<span>{content}</span>
				{hasClose ? <i className="fa fa-close" onClick={this.handleClose}></i> : null}
			</div>
		)
	}
}

export default CSSModules(Tag, style,{handleNotFoundStyleName:'log'});
