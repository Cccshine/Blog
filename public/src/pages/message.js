import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Pagination from '../component/pagination/pagination';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/message.scss';
import blogGlobal from '../data/global';

class Message extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status:0,
			messageList:[],
			// pageTotal: 0,
			// pageSize: 2,
			// lastTime:""
		}
		this.currentPage = 0;
		this.pageTotal = 0;
		this.pageSize = blogGlobal.pageSize;
		this.lastTime = "";
		this.mounted = true;
	}

	componentDidMount = () => {;
		this.mounted = true
		this.fetchList((new Date()).toISOString(),0,this.pageSize,1);
	}

	componentWillUnmount = () => {
		this.mounted = false;
	}

	getCurrentPage = (currentPage) => {
		this.currentPage = currentPage;
	}

	fetchList = (lastTime,currentPage,pageSize,dir) => {
		let url = blogGlobal.requestBaseUrl + "/message?lastTime="+lastTime+"&currentPage="+currentPage+"&pageSize="+pageSize+"&dir="+dir;
		fetch(url, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			if(!this.mounted){
				return;
			}
			//console.log(json);
			let { status, messageList ,pageTotal} = json;
			if (status == 0) {
				this.setState({ status: 2 });
			} else if (status == 1) {
				this.pageTotal = pageTotal;
				this.lastTime = messageList[messageList.length - 1]._id;
				this.setState({ status: 1, messageList: messageList});
			}
		}).catch((err) => {
			//console.log(err);
		});
	}

	render() {
		let { currentPage, pageTotal, pageSize, lastTime } = this;
		let { status,messageList} = this.state;
		let pageProps ={
			currentPage: currentPage,
			pageSize: pageSize,
			pageTotal: pageTotal,
			lastTime: lastTime,
			getCurrentPage: this.getCurrentPage,
			fetchList: this.fetchList
		}
		return (
			<div styleName="root">
				{
					(() => {
						switch (status) {
							case 1:
								return (
									<div>
										{
											messageList.map((item, index) => {
												return (
													<section styleName="message-section" key={index}>
														<span styleName="timeline-circle"></span>
														<span styleName="timeline-date">{moment(item._id).format('YYYY-MM-DD')}</span>
														<ul styleName="msg-list">
															{
																item.value.infos ? 
																item.value.infos.map((subitem, subindex) => {
																	return (
																		<li key={subindex}>
																			<Link to={`/user/${subitem.operateUser.name}`}>{subitem.operateUser.name}</Link>
																			{{
																		        [1]: '收藏了你的文章',
																		        [2]: '点赞了你的文章',
																		        [3]: '评论了你的文章',
																		        [4]: '点赞了你的评论',
																		        [5]: '回复了你的评论',
																		    }[subitem.messageMode]}	
																			{
																				!subitem.article ? <span style={{color:'#999',marginLeft:'5px'}}>相关文章已删除</span> : <Link to={`/articles/${subitem.article._id}`}>{subitem.messageMode > 3 ? subitem.comment.content : subitem.article.title}</Link>
																			}	
															    		</li>		
														    		)
																}) : <li key={item.value._id}>
																		<Link to={`/user/${item.value.operateUser.name}`}>{item.value.operateUser.name}</Link>
																		{{
																			[1]: '收藏了你的文章',
																			[2]: '点赞了你的文章',
																			[3]: '评论了你的文章',
																			[4]: '点赞了你的评论',
																			[5]: '回复了你的评论',
																		}[item.value.messageMode]}	
																		{
																			!item.value.article ? <span style={{color:'#999',marginLeft:'5px'}}>相关文章已删除</span> : <Link to={`/articles/${item.value.article._id}`}>{item.value.messageMode > 3 ? item.value.comment.content : item.value.article.title}</Link>
																		}	
																	</li>
															}
														</ul>
													</section>
												)
											})
										}
										<Pagination {...pageProps}/>
									</div>
								)
								break;
							case 2:
								return <h3 styleName="null-tip" style={{display:'none'}}>暂无提醒</h3>
								break;
							default:
								return <div styleName="loading" style={{display:'none'}}><i className="fa fa-spinner fa-pulse"></i><span>正在加载...</span></div>
								break;
						}
					})()
				}
				{status == 1 ? <div styleName="timeline-bar"></div> : null}
			</div>
		)
	}
}

export default CSSModules(Message, style, { handleNotFoundStyleName: 'log' });