import React from 'react';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import style from './select.scss'

class Select extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			isDown:false,
			text:props.list[0]
		}
	}

	componentWillMount = () =>{
		document.addEventListener('click', this.hideOption, false);
	}

	componentWillUnmount = () =>{
		document.removeEventListener('click', this.hideOption, false);
	}

	hideOption = () => {
		if(!this.state.isDown){
			return;
		}
		this.setState({isDown:false});
	}

	handleDown = (event) => {
		this.setState({isDown:!this.state.isDown});
		event.nativeEvent.stopImmediatePropagation();
	}

	handleSelect = (event) => {
		this.setState({isDown:false,text:event.target.innerText});
	}

	render(){
		let {list} = this.props;
		let {isDown,text} = this.state;
		let optionStyle ={
			display: isDown ? 'block' : 'none'
		}
		return (
			<div styleName="select">
				<span ref="showText">{text}</span>
				<i className={"fa "+ (isDown ? "fa-caret-up" : "fa-caret-down")} onClick={this.handleDown}></i>
				<ul style={optionStyle} onClick={this.handleSelect}>
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
