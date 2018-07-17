import React from 'react';
import { Link } from 'react-router-dom';
import Tag from '../component/tag/tag';
import Pagination from '../component/pagination/pagination';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/user.scss';
import blogGlobal from '../util/global';
import { marked, sendRequest, setPageAttr, getCurrentPage, getDateDiff } from '../util/util';


class Activity extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			status:0,
			activityList:[],
		}
		setPageAttr.call(this);
		this.mounted = true;
		this.activeUsername = props.match.params.username;
		this.activeUserId = null;
	}

	componentWillMount = () => {
		this.mounted = true;
		this.fetchUserAndList();
	}

	componentWillUnmount = () => {
		this.mounted = false;
	}

	componentWillReceiveProps = (nextProps) => {
		if(this.activeUsername !== nextProps.match.params.username){
			this.activeUsername = nextProps.match.params.username; 
			this.currentPage = 0;
			this.fetchUserAndList();
		}
	}

	fetchUserAndList = () => {
		let url = blogGlobal.requestBaseUrl + "/user?username="+this.activeUsername;
		sendRequest(url, 'get', null, (json) => {
			if(!this.mounted){
				return;
			}
			this.activeUserId = json.userInfo._id;
			this.fetchList((new Date()).toISOString(),0,this.pageSize,1);
		});
	}

	fetchList = (lastTime,currentPage,pageSize,dir) => {
		let url = blogGlobal.requestBaseUrl + "/activity?userId=" + this.activeUserId +"&lastTime="+lastTime+"&currentPage="+currentPage+"&pageSize="+pageSize+"&dir="+dir;
		
		sendRequest(url, 'get', null, (json) => {
			if(!this.mounted){
				return;
			}
			//console.log(json);
			let { status, activityList ,pageTotal} = json;
			if (status == 0) {
				this.setState({ status: 2 });
			} else if (status == 1) {
				this.pageTotal = pageTotal;
				this.lastTime = activityList[activityList.length - 1].createTime;
				this.setState({ status: 1, activityList: activityList});
			}
		});
	}

	render(){
		let { currentPage, pageTotal, pageSize, lastTime } = this;
		let {activityList,status} = this.state;
		let tagProps = { isLink: true, hasClose: false };
		let pageProps ={
			currentPage: currentPage,
			pageSize: pageSize,
			pageTotal: pageTotal,
			lastTime: lastTime,
			fetchList: this.fetchList,
			getCurrentPage: getCurrentPage.bind(this)
		}
		return(
			<div>
				{
					(() => {
						switch (status) {
							case 1:
								return (
									<div styleName="profile-active-list">
										{
											activityList.map((item, index) => {
												let article = item.article;
												if(!article){
													return (
														<section styleName="list-item" key={index}>
															<div styleName="list-item-meta">{{
																[1]: '收藏',
																[2]: '点赞',
																[3]: '取消收藏',
																[4]: '取消点赞',
																[5]: '评论',
															  }[item.activityMode]}文章（{getDateDiff(item.createTime)}）
															</div>
															<div style={{color:'#999',margin:'5px 0'}}>
															  该动态相关的文章已删除
															</div>
														</section>
													);
												}
												let list = article.tag.split(';');
												list = list.slice(0, list.length - 1);
												return(
													<section styleName="list-item" key={index}>
														<div styleName="list-item-meta">{{
													        [1]: '收藏',
													        [2]: '点赞',
													        [3]: '取消收藏',
													        [4]: '取消点赞',
													        [5]: '评论',
													      }[item.activityMode]}文章（{getDateDiff(item.createTime)}）
												      	</div>
												      	<div>
												      		<div className="clearfix">
												      			<h3 className="fl"><Link target="_blank" to={"/articles/" + article._id}>{article.title}</Link></h3>
											      			</div>
											      			<div styleName="tag-panel">
											      				<Tag {...tagProps} list={list} />
										      				</div>
										      				<div styleName="summary" className="markdown">
										      					<p dangerouslySetInnerHTML={{ __html: marked(article.summary) }}></p>
									      					</div>
									      					<div className="clearfix">
									      						<div styleName="article-info" className="fl">
									      							<div><i className="fa fa-thumbs-up"></i><span>赞({article.praiseUser.length})</span></div>
																	<div><i className="fa fa-bookmark"></i><span>收藏({article.collectionUser.length})</span></div>
																	<div><i className="fa fa-commenting"></i><span>评论({article.commentTotal})</span></div>
																</div>
																<div styleName="more" className="fr"><Link target="_blank" to={"/articles/"  + article._id}>阅读全文</Link></div>
															</div>
														</div>
													</section>
												)
											})
										}
										<Pagination {...pageProps}/>
									</div>
								)
								break;
							case 2:
								return <h3 styleName="null-tip">暂无动态</h3>
								break;
							default :
								return <div styleName="loading"><i className="fa fa-spinner fa-pulse"></i><span>正在加载...</span></div>
								break;
						}
					})()
				}
			</div>
		)
	}
}
export default CSSModules(Activity, style, { handleNotFoundStyleName: 'log' });