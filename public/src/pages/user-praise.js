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

class Praise extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			praiseArticles:[],
			status:0,
			pageTotal: 0,
			pageSize: 2,
			lastTime:""
		}
	}

	componentWillMount = () => {
		this.fetchList((new Date()).toISOString(),0,this.state.pageSize,1);
	}

	fetchList = (lastTime,currentPage,pageSize,dir) => {
		let url = blogGlobal.requestBaseUrl + "/articles?mode=praise&userId=" + sessionStorage.getItem('uid') +"&lastTime="+lastTime+"&currentPage="+currentPage+"&pageSize="+pageSize+"&dir="+dir;
		fetch(url, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
			let { status, articleList ,pageTotal} = json;
			if (status == 0) {
				this.setState({ status: 2 });
			} else if (status == 1) {
				this.setState({ status: 1, praiseArticles: articleList ,pageTotal:pageTotal, lastTime:articleList[articleList.length - 1].createTime});
			}
		}).catch((err) => {
			console.log(err);
		});
	}

	render(){
		let {praiseArticles,status,pageSize,pageTotal,lastTime} = this.state;
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
											praiseArticles.map((item, index) => {
												let list = item.tag.split(';');
												list = list.slice(0, list.length - 1);
												return(
													<section styleName="list-item" key={index}>
												      	<div styleName="list-item-content">
												      		<div className="clearfix">
												      			<h3 className="fl"><Link target="_blank" to={"/articles/" + item._id}>{item.title}</Link></h3>
											      			</div>
											      			<div styleName="tag-panel">
											      				<Tag {...tagProps} list={list} />
										      				</div>
										      				<div styleName="summary">
										      					<p dangerouslySetInnerHTML={{ __html: marked(item.summary) }}></p>
									      					</div>
									      					<div className="clearfix">
									      						<div styleName="article-info" className="fl">
									      							<div><i className="fa fa-thumbs-up"></i><span>赞({item.praiseUser.length})</span></div>
																	<div><i className="fa fa-bookmark"></i><span>收藏({item.collectionUser.length})</span></div>
																	<div><i className="fa fa-commenting"></i><span>评论({item.commentTotal})</span></div>
																</div>
																<div styleName="more" className="fr"><Link target="_blank" to={"/articles/"  + item._id}>阅读全文</Link></div>
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
								return <h3 styleName="null-tip">暂无点赞的文章</h3>
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
export default CSSModules(Praise, style, { handleNotFoundStyleName: 'log' });