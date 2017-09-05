import React from 'react';
import Modal from '../component/modal/modal';

export default class Home extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		let modalHtml = <p>您还未登录，是否前往登录？</p>;
		return(
			<div>
				<Modal title="登录提醒" modalHtml={modalHtml} />
				<h1>我是首页</h1>
			</div>
		)
	}
}