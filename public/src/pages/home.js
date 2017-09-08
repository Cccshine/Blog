import React from 'react';
import Modal from '../component/modal/modal';

export default class Home extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			isLogin:props.isLogin,
			isOpen:!sessionStorage.getItem('loginTipClose') 
		}
	}
	
	handleModalOk = () => {
		this.props.history.push('/login')
	}

	handleModalClose = () => {
		console.log('aaa')
		this.setState({isOpen:false});
		sessionStorage.setItem('loginTipClose',true);
	}

	render(){
		let modalHtml = <p className="tips-in-modal">您还未登录，是否前往登录？<span className="small-tip">(登录后可评论)</span></p>;
		let modalProps = {
			isOpen:this.state.isOpen,
			title:'登录提醒',
			modalHtml:modalHtml,
			btns:[{name:'确定',ref:'ok',handleClick:this.handleModalOk},{name:'取消',ref:'close'}],
			handleModalClose:this.handleModalClose
		}
		return(
			<div>
				<h1>我是首页</h1>
				{this.state.isLogin ? null : <Modal {...modalProps} />}
			</div>
		)
	}
}
