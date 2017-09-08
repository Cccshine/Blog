import React from 'react';
import CSSModules from 'react-css-modules';
import style from './tip-bar.scss';

const TipBar = (props) => {
	let {arrow,type,text,classNames} = props;
	let tipType = 'tip-'+arrow+'-arrow-'+type
	let icon = {
		'info':'fa-info-circle',
		'error':'fa-times-circle',
		'success':'fa-check-circle'
	}[type];
	return (
		<div styleName={tipType} data-role={tipType} className={classNames}>
			<i className={'fa '+icon}></i>
			<span>{text}</span>
		</div>
	)
}

export default CSSModules(TipBar, style,{handleNotFoundStyleName:'log'});
