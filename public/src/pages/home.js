import React from 'react';
import {Link} from 'react-router-dom';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/home.scss';
import blogGlobal from '../data/global';

const url = blogGlobal.requestBaseUrl+"/article-list";

// let summaryList = [
// 	{
// 		title:"你不知道的z-index",
// 		tagString:"html;css;",
// 		summary:"text-align 会对块元素(或者display:block的元素）中的所有内联内容水平居中，可以继承，它里面所有的文字或者图片，都会相对于最靠近自己的块状父元素来实现居中。但对块状子元素是没用的，不能实现块状子元素在块状父元素中整体居中。该属性只能在块元素上设置，在内联元素上不起作用",
// 		date:"2017-9-11"
// 	},
// 	{
// 		title:"你不知道的z-index",
// 		tagString:"html;css;",
// 		summary:"text-align 会对块元素(或者display:block的元素）中的所有内联内容水平居中，可以继承，它里面所有的文字或者图片，都会相对于最靠近自己的块状父元素来实现居中。但对块状子元素是没用的，不能实现块状子元素在块状父元素中整体居中。该属性只能在块元素上设置，在内联元素上不起作用",
// 		date:"2017-9-11"
// 	},
// 	{
// 		title:"你不知道的z-index",
// 		tagString:"html;css;",
// 		summary:"text-align 会对块元素(或者display:block的元素）中的所有内联内容水平居中，可以继承，它里面所有的文字或者图片，都会相对于最靠近自己的块状父元素来实现居中。但对块状子元素是没用的，不能实现块状子元素在块状父元素中整体居中。该属性只能在块元素上设置，在内联元素上不起作用",
// 		date:"2017-9-11"
// 	},
// ]

class Home extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			isLogin:props.isLogin,
			isOpen:!sessionStorage.getItem('loginTipClose'),
			status:0,//0--正在获取 1--获取成功 2--暂无文章
			summaryList:null
		}
	}

	componentWillMount = () => {
		fetch(url,{
			method:'get',
		    mode:'cors',
		    credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
			let {status,articleList} = json;
			if(status == 0){
				// this.setState({status:2});
			}else if(status == 1){
				// this.setState({status:1,summaryList:articleList});
			}
		}).catch((err) => {
			console.log(err);
		});
	}
	
	handleModalOk = () => {
		this.props.history.push('/login')
	}

	handleModalClose = () => {
		this.setState({isOpen:false});
		sessionStorage.setItem('loginTipClose',true);
	}

	render(){
		let {status,summaryList,isLogin} = this.state;
		let modalHtml = <p className="tips-in-modal">您还未登录，是否前往登录？<span className="small-tip">(登录后可评论)</span></p>;
		let modalProps = {
			isOpen:this.state.isOpen,
			title:'登录提醒',
			modalHtml:modalHtml,
			btns:[{name:'确定',ref:'ok',handleClick:this.handleModalOk},{name:'取消',ref:'close'}],
			handleModalClose:this.handleModalClose
		}
		let tagProps = {isLink:true,hasClose:false};
		return(
			<div styleName="root">
				{
					(() => {
						switch (status) {
							case 1:
								summaryList.map((item,index) => {
									let list = item.tag.split(';');
									list = list.slice(0,list.length - 1);
									return (
										<section styleName="summary-section" key={index}>
											<h3><Link to="/">{item.title}</Link></h3>
											<div styleName="tag-panel">
												<Tag {...tagProps} list={list}/>
											</div>
											<div styleName="summary">
												<p>{item.content}</p>
											</div>
											<span styleName="timeline-circle"></span>
											<span styleName="timeline-date">{item.publicTime}</span>
										</section>
									)
								});
								<div styleName="timeline-bar"></div>
								break;
						case 2:
								<h3 styleName="null-tip">暂无文章</h3>
								break;
						default:
								<div styleName="loading">正在加载</div>
								break;
						}
					})()
				}
				{isLogin ? null : <Modal {...modalProps} />}
			</div>
		)
	}
}

export default CSSModules(Home, style,{handleNotFoundStyleName:'log'});