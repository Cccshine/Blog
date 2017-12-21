import React from 'react';
import moment from 'moment';
import Tag from '../component/tag/tag';
import Select from '../component/select/select';
import { Link } from 'react-router-dom';
import TipBar from '../component/tipBar/tip-bar';
import Modal from '../component/modal/modal';
import blogGlobal from '../data/global';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/draft.scss'

class Draft extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: 0,//0--正在获取 1--获取成功 2--暂无草稿
			draftList: null,
			showModal: false,
			tipType: '',
			showTip: false,
			tipText: '',
			articleId: null
		}
	}

	componentWillMount = () => {
		this.fetchList();
	}

	fetchList(){
		let url = blogGlobal.requestBaseUrl + "/articles/?mode=draft";
		fetch(url, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
			let { status, draftList } = json;
			if (status == 0) {
				this.setState({ status: 2 });
			} else if (status == 1) {
				this.setState({ status: 1, draftList: draftList });
			}
		}).catch((err) => {
			console.log(err);
		});
	}

	handleEdit = (articleId, e) => {
		this.props.history.push({ pathname: '/write/'+articleId})
	}

	handleQuitDraft = (articleId, e) => {
		this.setState({ showModal: true, articleId: articleId });
	}

	comfirmQuit = () => {
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

	handleModalClose = () => {
		this.setState({ showModal: false });
	}

	hideTip = () => {
		setTimeout(() => this.setState({ showTip: false }), 1000);
	}


	//发送请求mode: post--新建/保存草稿/发布文章 delete--舍弃草稿
	sendRequest = (mode, data, callback) => {
		fetch(blogGlobal.requestBaseUrl + "/articles", {
			method: mode,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			credentials: 'include',
			body: data ? JSON.stringify(data) : null
		}).then((response) => {
			return response.json();
		}).then((json) => {
			callback && callback(json);
		}).catch((err) => {
			console.log(err);
		});
	}

	render() {
		let { status, draftList, showModal, showTip, tipType, tipText } = this.state;
		let tipProps = {
			arrow: 'no',
			type: tipType,
			text: tipText,
			classNames: 'tip-bar-alert'
		}
		let modalProps = {
			isOpen: showModal,
			title: '舍弃草稿提醒',
			modalHtml: <p className="tips-in-modal">确定舍弃已保存的草稿吗？</p>,
			btns: [{ name: '确定', ref: 'ok', handleClick: this.comfirmQuit }, { name: '取消', ref: 'close' }],
			handleModalClose: this.handleModalClose
		}
		return (
			<div styleName="root">
				<ul styleName="draft-list">
					{
						(() => {
							switch (status) {
								case 1:
									return (
										draftList.map((item, index) => {
											let list = item.tag.split(';');
											list = list.slice(0, list.length - 1);
											return (
												<li styleName="draft-item" key={index}>
													<h3><Link target="_self" to={"/write/" + item._id}>{item.title || '无标题'}</Link></h3>
													<div className="clearfix">
														<div styleName="save-time" className="fl">保存于{moment(item.updateTime).format('YYYY-MM-DD')}</div>
														<div styleName="btn-group" className="fr">
															<button className="btn-normal btn-sm"><Link target="_self" to={"/write/" + item._id}>编辑</Link></button>
															<button className="btn-normal btn-sm" onClick={this.handleQuitDraft.bind(this, item._id)}>舍弃</button>
														</div>
													</div>
												</li>
											)
										})
									)
									break;
								case 2:
									return <h3 styleName="null-tip">暂无草稿</h3>
									break;
								default:
									return <div styleName="loading"><i className="fa fa-spinner fa-pulse"></i><span>正在加载...</span></div>
									break;
							}
						})()
					}
				</ul>
				{showTip ? <TipBar {...tipProps} /> : null}
				{showModal ? <Modal {...modalProps} /> : null}
			</div>
		)
	}
}

export default CSSModules(Draft, style, { handleNotFoundStyleName: 'log' });