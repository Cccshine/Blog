import React from 'react';
import moment from 'moment';
import marked from 'marked';
import { Link } from 'react-router-dom';
import Modal from '../component/modal/modal';
import TipBar from '../component/tipBar/tip-bar';
import Pagination from '../component/pagination/pagination';
import TagComponent from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/archive.scss';
import blogGlobal from '../data/global';

let year = null, month = null;
class Archive extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: 0,//0--正在获取 1--获取成功 2--暂无文章
			archiveList: [],
			isArchiveList: false,
			articleList: [],
			articleId: null,
			role: props.role,
			delModalShow: false,
			showTip: false,
			pageTotal: 0,
			pageSize: 2,
			lastTime:""
		}
	}
	componentWillMount = () => {
		let time = this.props.match.params.time || null;
		if(time){
			this.fetchList((new Date()).toISOString(),0,this.state.pageSize,1);
		}else{
			this.setState({ isArchiveList: true });
			let url = blogGlobal.requestBaseUrl + "/articles?mode=archive";
			fetch(url, {
				method: 'get',
				mode: 'cors',
				credentials: 'include',
			}).then((response) => {
				return response.json();
			}).then((json) => {
				let { status, archiveList } = json;
				this.setState({ status: status, archiveList: archiveList });
				console.log(json);
			}).catch((err) => {
				console.log(err);
			});
		}
	}

	fetchList = (lastTime,currentPage,pageSize,dir) => {
		let time = this.props.match.params.time || null;
		year = time.slice(0,4);
		month = time.slice(4)
		let realTime = year + '-' + month;
		let startTime = moment(realTime).format('x')*1;
		let endTime = moment(startTime).add(1,'months').subtract(1,'seconds').format('x')*1;
		let url = blogGlobal.requestBaseUrl + "/articles?mode=archive&startTime="+startTime+"&endTime="+endTime+"&lastTime="+lastTime+"&currentPage="+currentPage+"&pageSize="+pageSize+"&dir="+dir;
		fetch(url, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			let { status, articleList ,pageTotal } = json;
			if (status == 0) {
				this.setState({ status: 2 });
			} else if (status == 1) {
				this.setState({ status: 1, articleList: articleList ,pageTotal:pageTotal, lastTime:articleList[articleList.length - 1].publicTime});
			}
		}).catch((err) => {
			console.log(err);
		});
	}

	handleDelete = (articleId, event) => {
		this.setState({ delModalShow: true, articleId: articleId });
	}

	comfirmDel = () => {
		this.setState({ delModalShow: false });
		let articleId = this.state.articleId;
		let data = {
			articleId: articleId
		}
		fetch(blogGlobal.requestBaseUrl + "/articles", {
			method: 'delete',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			credentials: 'include',
			body: JSON.stringify(data)
		}).then((response) => {
			return response.json();
		}).then((json) => {
			this.setState({ showTip: true });
			this.fetchList();
			this.hideTip();
		}).catch((err) => {
			console.log(err);
		});
	}

	render() {
		let { status, archiveList, isArchiveList, articleList, role, delModalShow, showTip, pageSize, pageTotal, lastTime} = this.state;
		let delModalProps = {
			isOpen: delModalShow,
			title: '删除提醒',
			modalHtml: <p className="tips-in-modal">确定删除该文章吗？</p>,
			btns: [{ name: '确定', ref: 'ok', handleClick: this.comfirmDel }, { name: '取消', ref: 'close' }],
			handleModalClose: this.handleDelModalClose
		}
		let tagProps = { isLink: true, hasClose: false };
		let tipProps = {
			arrow: 'no',
			type: 'success',
			text: '删除成功',
			classNames: 'tip-bar-alert'
		}
		let pageProps ={
			pageSize: pageSize,
			pageTotal: pageTotal,
			lastTime: lastTime,
			fetchList: this.fetchList
		}
		let rootPadding = isArchiveList ? {padding:20} : {padding:'20px 20px 20px 100px'};
		return (
			<div styleName="root" style={rootPadding}>
				{
					(() => {
						switch (status) {
							case 1:
								return (
									isArchiveList ? 
									<ul styleName="archive-list">
										{
											archiveList.map((item, index) => {
												return (
													<li key={index} styleName="archive-item">
														<Link target="_blank" to={"/archive/" + item._id}>{item._id.slice(0,4)}年{item._id.slice(4)}月</Link>
														<span styleName="sum">{item.total}</span>
													</li>
												)
											})
										}
									</ul> : 
									<div>
										<h2 styleName="archive-title"><span styleName="timeline-circle"></span><strong>{year}年{month}月</strong>归档</h2>
										{
											articleList.map((item, index) => {
												let list = item.tag.split(';');
												list = list.slice(0, list.length - 1);
												return (
													<section styleName="summary-section" key={index}>
														<div className="clearfix">
															<h3 className="fl"><Link target="_blank" to={"/articles/" + item._id}>{item.title}</Link></h3>
															{
																role === 0 ? null : <div styleName="btn-group" className="fr">
																	<button className="btn-normal btn-sm"><Link target="_self" to={"/write/" + item._id}>编辑</Link></button>
																	<button className="btn-normal btn-sm" onClick={this.handleDelete.bind(this, item._id)}>删除</button>
																</div>
															}
														</div>
														<div styleName="tag-panel">
															{<TagComponent {...tagProps} list={list} />}
														</div>
														<div styleName="summary">
															<p dangerouslySetInnerHTML={{ __html: marked(item.summary) }}></p>
														</div>
														<div styleName="more">
															<Link target="_blank" to={"/articles/" + item._id}>查看更多</Link>
														</div>
														<span styleName="timeline-circle"></span>
														<span styleName="timeline-date">{moment(item.publicTime).format('YYYY-MM-DD')}</span>
													</section>
												)
											})
										}
										<Pagination {...pageProps}/>
									</div>									
								)
								break;
							case 2:
								return <h3 styleName="null-tip">暂无文章</h3>
								break;
							default:
								return <div styleName="loading"><i className="fa fa-spinner fa-pulse"></i><span>正在加载...</span></div>
								break;
						}
					})()
				}
				{status == 1 && !isArchiveList ? <div styleName="timeline-bar"></div> : null}
				{delModalShow ? <Modal {...delModalProps} /> : null}
				{showTip ? <TipBar {...tipProps} /> : null}
			</div>
		)
	}
}

export default CSSModules(Archive, style, { handleNotFoundStyleName: 'log' });