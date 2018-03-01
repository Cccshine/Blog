import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import moment from 'moment';
import marked from 'marked';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import Pagination from '../component/pagination/pagination';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/user.scss';
import blogGlobal from '../data/global';

class Activity extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			status:0,
			activityList:[],
			pageTotal: 0,
			pageSize: 2,
			lastTime:""
		}
	}

	componentWillMount = () => {
		this.fetchList((new Date()).toISOString(),0,this.state.pageSize,1);
	}

	fetchList = (lastTime,currentPage,pageSize,dir) => {
		let url = blogGlobal.requestBaseUrl + "/activity?userId=" + sessionStorage.getItem('uid') +"&lastTime="+lastTime+"&currentPage="+currentPage+"&pageSize="+pageSize+"&dir="+dir;
		fetch(url, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
			let { status, activityList ,pageTotal} = json;
			if (status == 0) {
				this.setState({ status: 2 });
			} else if (status == 1) {
				this.setState({ status: 1, activityList: activityList ,pageTotal:pageTotal, lastTime:activityList[activityList.length - 1].createTime});
			}
		}).catch((err) => {
			console.log(err);
		});
	}

	getDateDiff(date) {
		let timestamp = moment(date).format('x');
		let minute = 1000 * 60;
		let hour = minute * 60;
		let day = hour * 24;
		let halfamonth = day * 15;
		let month = day * 30;
		let year = month * 12;
		let now = new Date().getTime();
		let diffValue = now - timestamp;
		if (diffValue < 0) {
			return '未知';
		}
		let yearC = diffValue / year;
		let monthC = diffValue / month;
		let weekC = diffValue / (7 * day);
		let dayC = diffValue / day;
		let hourC = diffValue / hour;
		let minC = diffValue / minute;
		let result = '';
		if(yearC >= 1){
			result = "" + parseInt(yearC) + "年前";
		}
		else if (monthC >= 1) {
			result = "" + parseInt(monthC) + "月前";
		}
		else if (weekC >= 1) {
			result = "" + parseInt(weekC) + "周前";
		}
		else if (dayC >= 1) {
			result = "" + parseInt(dayC) + "天前";
		}
		else if (hourC >= 1) {
			result = "" + parseInt(hourC) + "小时前";
		}
		else if (minC >= 1) {
			result = "" + parseInt(minC) + "分钟前";
		} else
			result = "刚刚";
		return result;
	}

	render(){
		let {activityList,status,pageSize,pageTotal,lastTime} = this.state;
		let tagProps = { isLink: true, hasClose: false };
		let pageProps ={
			pageSize: pageSize,
			pageTotal: pageTotal,
			lastTime: lastTime,
			fetchList: this.fetchList
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
													      }[item.activityMode]}文章（{this.getDateDiff(item.createTime)}）
												      	</div>
												      	<div styleName="list-item-content">
												      		<div className="clearfix">
												      			<h3 className="fl"><Link target="_blank" to={"/articles/" + article._id}>{article.title}</Link></h3>
											      			</div>
											      			<div styleName="tag-panel">
											      				<Tag {...tagProps} list={list} />
										      				</div>
										      				<div styleName="summary">
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