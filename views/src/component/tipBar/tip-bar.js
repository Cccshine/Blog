import React from 'react';
import CSSModules from 'react-css-modules';
import style from './tip-bar.scss';

const TipBar = (props) => {
	var icon = {
		'info':'fa-info-circle',
		'error':'fa-times-circle',
		'success':'fa-check-circle'
	}[props.type];
	return (
		<div styleName={'tip-'+props.type}>
			<i className={'fa '+icon}></i>
			<span>{props.text}</span>
		</div>
	)
}

export default CSSModules(TipBar, style,{handleNotFoundStyleName:'log'});
