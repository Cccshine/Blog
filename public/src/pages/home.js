import React from 'react';
import moment from 'moment';
import marked from 'marked';
import { Link } from 'react-router-dom';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/home.scss';
import blogGlobal from '../data/global';

const url = blogGlobal.requestBaseUrl + "/article-list";

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLogin: props.isLogin,
			loginModalShow: !sessionStorage.getItem('loginTipClose'),
			delModalShow: false,
			status: 0,//0--正在获取 1--获取成功 2--暂无文章
			summaryList: null,
			articleId: null
		}
	}

	componentWillMount = () => {
		fetch(url, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
			let { status, articleList } = json;
			if (status == 0) {
				this.setState({ status: 2 });
			} else if (status == 1) {
				this.setState({ status: 1, summaryList: articleList });
			}
		}).catch((err) => {
			console.log(err);
		});
	}

	handleDelete = (event,articleId) => {
		this.setState({ showModal: true, articleId: articleId });
	}

	comfirmDel = () => {
		this.setState({ showModal: false });
		let articleId = this.state.articleId;
		let data = {
			articleId: articleId
		}
		this.sendRequest('delete', data, (json) => {
			this.setState({ showTip: true, tipType: 'success', tipText: '舍弃成功' });
			this.fetchList();
			this.hideTip();
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
		this.setState({delModalShow: false})
	}

	render() {
		let { status, summaryList, isLogin, loginModalShow, delModalShow } = this.state;
		let modalHtml = <p className="tips-in-modal">您还未登录，是否前往登录？<span className="small-tip">(登录后可评论)</span></p>;
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
			btns: [{ name: '确定', ref: 'ok', handleClick: this.comfirmDel}, { name: '取消', ref: 'close' }],
			handleModalClose: this.handleDelModalClose
		}
		let tagProps = { isLink: true, hasClose: false };
		return (
			<div styleName="root">
				{
					(() => {
						switch (status) {
							case 1:
								return (
									summaryList.map((item, index) => {
										let list = item.tag.split(';');
										list = list.slice(0, list.length - 1);
										return (
											<section styleName="summary-section" key={index}>
												<div className="clearfix">
													<h3 className="fl"><Link target="_blank" to={"/articles/" + item.order}>{item.title}</Link></h3>
													<div styleName="btn-group" className="fr">
														<button className="btn-normal btn-sm"><Link target="_self" to={"/write/" + item.order}>编辑</Link></button>
														<button className="btn-normal btn-sm" onClick={this.handleDelete.bind(this,item._id)}>删除</button>
													</div>
												</div>
												<div styleName="tag-panel">
													<Tag {...tagProps} list={list} />
												</div>
												<div styleName="summary">
													<p dangerouslySetInnerHTML={{ __html: marked(item.content) }}></p>
												</div>
												<span styleName="timeline-circle"></span>
												<span styleName="timeline-date">{moment(item.publicTime).format('YYYY-MM-DD')}</span>
											</section>
										)
									})
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
				{status == 1 ? <div styleName="timeline-bar"></div> : null}
				{isLogin ? null : <Modal {...modalProps} />}
				{delModalShow ? <Modal {...delModalProps} /> : null}
			</div>
		)
	}
}

export default CSSModules(Home, style, { handleNotFoundStyleName: 'log' });