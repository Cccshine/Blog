import React from 'react';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import style from './select.scss'

class Select extends React.Component{
	constructor(props) {
		super(props);
	}

	handleDown = (event) => {
		$(this.refs.selectList).toggle();
	}

	handleSelect = (event) => {
		$(this.refs.showText).text($(event.target).text());
		$(this.refs.selectList).hide();
	}

	render(){
		let {list} = this.props;
		return (
			<div styleName="type-select">
				<span ref="showText">{list[0]}</span>
				<i className="fa fa-caret-down" onClick={this.handleDown}></i>
				<ul className="hide" ref="selectList" onClick={this.handleSelect}>
					{
						list.map((item,index) => (
							<li key={index}>{item}</li>
						))
					}
				</ul>
			</div>
		)
	}
}

export default CSSModules(Select, style,{handleNotFoundStyleName:'log'});
