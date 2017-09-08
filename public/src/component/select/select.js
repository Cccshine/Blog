import React from 'react';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import style from './select.scss'

class Select extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			isDown:props.isDown,
			text:props.showText,
			value:props.showValue
		}
	}

	componentWillMount = () =>{
		document.addEventListener('click', this.hideOption, false);
	}

	componentWillUnmount = () =>{
		document.removeEventListener('click', this.hideOption, false);
	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({isDown:nextProps.isDown,text:nextProps.showText,value:nextProps.showValue});
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
		this.setState({isDown:false,text:event.target.innerText,value:event.target.dataset.value});
	}

	render(){
		let {showText,showValue,list,handleSelect} = this.props;
		let {isDown,text,value} = this.state;
		let optionStyle ={
			display: isDown ? 'block' : 'none'
		}
		return (
			<div styleName="select" data-role="select">
				<span ref="showText" data-value={value}>{text}</span>
				<i className={"fa "+ (isDown ? "fa-caret-up" : "fa-caret-down")} onClick={this.handleDown}></i>
				<ul style={optionStyle} onClick={handleSelect ? handleSelect : this.handleSelect}>
					{
						list.map((item,index) => (
							<li key={index} data-value={item.value}>{item.name}</li>
						))
					}
				</ul>
			</div>
		)
	}
}

export default CSSModules(Select, style,{handleNotFoundStyleName:'log'});
