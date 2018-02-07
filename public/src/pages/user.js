import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/user.scss';
import blogGlobal from '../data/global';

export default class User extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div styleName="root">
				
			</div>
		)
	}
}
export default CSSModules(User, style, { allowMultiple: true, handleNotFoundStyleName: 'log' });