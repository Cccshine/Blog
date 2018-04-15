import React from 'react';
import moment from 'moment';
import marked from 'marked';
import { Link } from 'react-router-dom';
import Modal from '../component/modal/modal';
import TipBar from '../component/tipBar/tip-bar';
import Tag from '../component/tag/tag';
import Pagination from '../component/pagination/pagination';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/home.scss';
import blogGlobal from '../data/global';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLogin: props.isLogin,
			loginModalShow: !sessionStorage.getItem('loginTipClose'),
			delModalShow: false,
			status: 0,//0--正在获取 1--获取成功 2--暂无文章
			summaryList: null,
			articleId: null,
			showTip: false,
			role: props.role,
			pageTotal: 0,
			pageSize: 2,
			lastTime:""
		}
	}

	componentDidMount = () => {
		this.fetchList((new Date()).toISOString(),0,this.state.pageSize,1);
	}

	fetchList = (lastTime,currentPage,pageSize,dir) => {
		let url = blogGlobal.requestBaseUrl + "/articles?mode=public&lastTime="+lastTime+"&currentPage="+currentPage+"&pageSize="+pageSize+"&dir="+dir;
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
				this.setState({ status: 1, summaryList: articleList ,pageTotal:pageTotal, lastTime:articleList[articleList.length - 1].publicTime});
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

	gotoLogin = () => {
		this.props.history.push('/login')
	}

	handleLoginModalClose = () => {
		this.setState({ loginModalShow: false });
		sessionStorage.setItem('loginTipClose', true);
	}

	handleDelModalClose = () => {
		this.setState({ delModalShow: false })
	}

	hideTip = () => {
		setTimeout(() => this.setState({ showTip: false }), 1000);
	}

	render() {
		let { status, summaryList, isLogin, loginModalShow, delModalShow, showTip, role ,pageTotal, pageSize, lastTime} = this.state;
		let modalHtml = <p className="tips-in-modal">您还未登录，是否前往登录？<span className="small-tip">(登录后可评论，点赞，收藏)</span></p>;
		let modalProps = {
			isOpen: loginModalShow,
			title: '登录提醒',
			modalHtml: modalHtml,
			btns: [{ name: '确定', ref: 'ok', handleClick: this.gotoLogin }, { name: '取消', ref: 'close' }],
			handleModalClose: this.handleLoginModalClose
		}
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
		return (
			<div styleName="root">
				{
					(() => {
						switch (status) {
							case 1:
								return (
									<div>
										{
											summaryList.map((item, index) => {
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
															<Tag {...tagProps} list={list} />
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
								return <h3 styleName="null-tip" style={{display:'none'}}>暂无文章</h3>
								break;
							default:
								return <div styleName="loading" style={{display:'none'}}><i className="fa fa-spinner fa-pulse"></i><span>正在加载...</span></div>
								break;
						}
					})()
				}
				{status == 1 ? <div styleName="timeline-bar"></div> : null}
				{isLogin ? null : <Modal {...modalProps} />}
				{delModalShow ? <Modal {...delModalProps} /> : null}
				{showTip ? <TipBar {...tipProps} /> : null}
			</div>
		)
	}
}

export default CSSModules(Home, style, { handleNotFoundStyleName: 'log' });