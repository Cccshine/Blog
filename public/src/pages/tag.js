import React from 'react';
import moment from 'moment';
import marked from 'marked';
import { Link } from 'react-router-dom';
import Modal from '../component/modal/modal';
import TipBar from '../component/tipBar/tip-bar';
import TagComponent from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/tag.scss';
import blogGlobal from '../data/global';

class Tag extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			articleList: [],
			status: 0,//0--正在获取 1--获取成功 2--暂无内容
			delModalShow: false,
			articleId: null,
			showTip: false,
			isTagList: false,
			role: props.role
		}
	}

	componentWillMount = () => {
		let tagName = this.props.match.params.tagName || null;
		if (tagName) {
			let url = blogGlobal.requestBaseUrl + "/articles?mode=public&tagName=" + tagName;
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
					this.setState({ status: 1, articleList: articleList });
				}
			}).catch((err) => {
				console.log(err);
			});
		} else {
			this.setState({ isTagList: true });
			let url = blogGlobal.requestBaseUrl + "/tags";
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
					this.setState({ status: 1, articleList: articleList });
				}
			}).catch((err) => {
				console.log(err);
			});
		}

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

	handleDelModalClose = () => {
		this.setState({ delModalShow: false })
	}

	hideTip = () => {
		setTimeout(() => this.setState({ showTip: false }), 1000);
	}

	render() {
		let { status, articleList, delModalShow, showTip, isTagList, role } = this.state;
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
		return (
			<div styleName="root">
				{
					(() => {
						switch (status) {
							case 1:
								return (
									isTagList ? <div>标签</div> :
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
								)
								break;
							case 2:
								return <h3 styleName="null-tip">暂无内容</h3>
								break;
							default:
								return <div styleName="loading"><i className="fa fa-spinner fa-pulse"></i><span>正在加载...</span></div>
								break;
						}
					})()
				}
				{status == 1 && !isTagList ? <div styleName="timeline-bar"></div> : null}
				{delModalShow ? <Modal {...delModalProps} /> : null}
				{showTip ? <TipBar {...tipProps} /> : null}
			</div>
		)
	}
}
export default CSSModules(Tag, style, { handleNotFoundStyleName: 'log' });