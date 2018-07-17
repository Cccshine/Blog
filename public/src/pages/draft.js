import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import TipBar from '../component/tipBar/tip-bar';
import Pagination from '../component/pagination/pagination';
import Modal from '../component/modal/modal';
import blogGlobal from '../util/global';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/draft.scss';
import { sendRequest, setPageAttr, getCurrentPage, handleDelete, comfirmDel, handleDelModalClose } from '../util/util';


class Draft extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: 0,//0--正在获取 1--获取成功 2--暂无草稿
			draftList: null,
			delModalShow: false,
			showTip: false,
		}
		this.articleId = null;
		this.mounted = true;
		setPageAttr.call(this);
	}

	componentDidMount = () => {
		this.mounted = true;
		this.fetchList((new Date()).toISOString(),0,this.pageSize,1);
	}

	componentWillUnmount = () => {
		this.mounted = false;
	}

	fetchList = (lastTime,currentPage,pageSize,dir) => {
		let url = blogGlobal.requestBaseUrl + "/articles/?mode=draft&lastTime="+lastTime+"&currentPage="+currentPage+"&pageSize="+pageSize+"&dir="+dir;
		sendRequest(url, 'get', null, (json) => {
			if(!this.mounted){
				return;
			}
			//console.log(json);
			let { status, articleList ,pageTotal } = json;
			if (status == 0) {
				this.setState({ status: 2 });
			} else if (status == 1) {
				this.pageTotal = pageTotal;
				this.lastTime = articleList[articleList.length - 1].publicTime;
				this.setState({ status: 1, draftList: articleList});
			}
		})
	}

	handleEdit = (articleId, e) => {
		this.props.history.push({ pathname: '/write/'+articleId})
	}

	render() {
		let { currentPage, pageSize, pageTotal, lastTime } = this;
		let { status, draftList, delModalShow, showTip} = this.state;
		let tipProps = {
			arrow: 'no',
			type: 'success',
			text: '舍弃成功',
			classNames: 'tip-bar-alert'
		}
		let modalProps = {
			isOpen: delModalShow,
			title: '舍弃草稿提醒',
			modalHtml: <p className="tips-in-modal">确定舍弃已保存的草稿吗？</p>,
			btns: [{ name: '确定', ref: 'ok', handleClick: comfirmDel.bind(this) }, { name: '取消', ref: 'close' }],
			handleModalClose: handleDelModalClose.bind(this)
		}
		let pageProps ={
			currentPage: currentPage,
			pageSize: pageSize,
			pageTotal: pageTotal,
			lastTime: lastTime,
			fetchList: this.fetchList,
			getCurrentPage: getCurrentPage.bind(this)
		}
		return (
			<div styleName="root">
				{
					(() => {
						switch (status) {
							case 1:
								return (
									<div>
										<ul styleName="draft-list">
											{
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
																	<button className="btn-normal btn-sm" onClick={handleDelete.bind(this, item._id)}>舍弃</button>
																</div>
															</div>
														</li>
													)
												})
											}
										</ul>
										<Pagination {...pageProps}/>
									</div>
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
				{showTip ? <TipBar {...tipProps} /> : null}
				{delModalShow ? <Modal {...modalProps} /> : null}
			</div>
		)
	}
}

export default CSSModules(Draft, style, { handleNotFoundStyleName: 'log' });