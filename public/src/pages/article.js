import React from 'react';
import marked from 'marked';
import Highlight from 'highlight.js';
import moment from 'moment';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/article.scss';
import blogGlobal from '../data/global';

let eHeadings = null, headingsOffset = [];//存储所有的h1,h2,h3标签及其距离顶部的距离
let loginUid = sessionStorage.getItem('uid');
let rendererMD = new marked.Renderer();
rendererMD.heading = function (text, level) {
	let className = Number(level) <= 3 ? 'heading' : '';
	return '<h' + level + ' id=' + text + ' class=' + className + '>' + text + '</h' + level + '>';
}
Highlight.initHighlightingOnLoad();
marked.setOptions({
	renderer: rendererMD,
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: false,
	smartLists: true,
	smartypants: false,
	highlight: function (code) {
		return Highlight.highlightAuto(code).value;
	}
});

class Article extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			catalog: [],
			content: "",
			praiseUser: [],
			collectionUser: [],
			commentTotal: 0,
			sidebarShow: true,
			article: null,
			activeCatalog: "",
			fixed: false,
			commentList: [],
			replyIndex: -1,
			replayUser:'',
			isCommentError: false,
			isReplyError: false,
		}
	}
	createCatalog = (html) => {
		let originTitle = html.match(/<(h[1-3]{1})[^>]*>(.*?)<\/h[1-3]{1}>/g);
		if (!originTitle) {
			this.setState({ sidebarShow: false });
			return;
		}
		let newTitle = [];
		let levelArr = [];
		//获得含有父子级关系的数组
		originTitle.map((item, index) => {
			let level = item.substr(2, 1);//标题级别
			let id = level + index;//标识符
			let eleId = item.match(/id="(.*?)"/)[1];//标题元素要设的id值
			let label = item.match(/>(.*?)</)[1];//标题内容
			let length = levelArr.length;
			//对应的父级标识符，顶级标题的pid为""
			let pid = length > 0 ? (Number(levelArr[length - 1].level) < Number(level) ? levelArr[length - 1].id : '') : '';
			levelArr.push({ level: level, id: id, eleId: eleId, label: label, pid: pid })
		});

		//将含有父子级关系的数组数据转换为树状数据
		function getTreeData(data, pid) {
			let treeData = [];
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				if (item.pid === pid) {
					treeData.push({ level: item.level, eleId: item.eleId, label: item.label, childs: getTreeData(data, item.id) })
				}
			}
			return treeData;
		}
		newTitle = getTreeData(levelArr, "");
		this.setState({ catalog: newTitle, activeCatalog: newTitle[0].eleId });
	}
	renderMenu = (menuList) => {
		let vdom = [];
		if (Object.prototype.toString.call(menuList) === "[object Array]") {
			let list = [];
			for (let item of menuList) {
				list.push(this.renderMenu(item));
			}
			vdom.push(
				<ol key="single">{list}</ol>
			)
		} else {
			vdom.push(
				<li key={menuList.eleId} styleName={('title-level-' + menuList.level) + (this.state.activeCatalog === menuList.eleId ? ' active' : '')}>
					<a href={'#' + menuList.eleId} styleName='catalog-anchor' onClick={this.handleCatalogClick}>
						<i className="fa fa-star"></i>
						<span>{menuList.label}</span>
					</a>
					{this.renderMenu(menuList.childs)}
				</li>
			)
		}
		return vdom;
	}
	componentWillMount = () => {
		document.body.className = 'article-detail';
		let url = blogGlobal.requestBaseUrl + "/articles?mode=detail&articleId=" + this.props.match.params.articleId;
		fetch(url, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
			this.setState({ article: json.article, content: json.article.content ,praiseUser: json.article.praiseUser,collectionUser: json.article.collectionUser});
			this.createCatalog(this.refs.content.innerHTML);
			eHeadings = document.getElementsByClassName('heading');
			for (let ele of eHeadings) {
				let item = {
					"top": this.getOffset(ele).top,//由于目录锚点正常定位会被fixed的header遮盖，所以对h1,h2,h3设置了padding-top=header的高度，这里不需要再减去header的高度60
					"anchorId": ele.getAttribute('id')
				}
				headingsOffset.push(item);
			}
			console.log(headingsOffset)
			headingsOffset.reverse();
		}).catch((err) => {
			console.log(err);
		});
		this.fetchComments();
		window.addEventListener('scroll', this.changeCatalog, false);
	}

	componentWillUnmount = () => {
		window.removeEventListener('scroll', this.changeCatalog, false);
		document.body.className = '';
	}

	changeCatalog = (event) => {
		let scroll = document.documentElement.scrollTop || document.body.scrollTop;
		if (scroll > 70) {//70为文章内容header的高度（不是指顶部header）
			this.setState({ fixed: true });
		} else {
			this.setState({ fixed: false });
		}
		for (let item of headingsOffset) {
			if (scroll >= item.top) {
				if (this.state.activeCatalog != item.anchorId) {
					this.setState({ activeCatalog: item.anchorId });
				}
				break;
			}
		}
	}

	handleCatalogClick = (event) => {
		let target = event.target;
		if (event.target.nodeName.toLowerCase() !== 'a') {
			target = event.target.parentNode;
		}
		this.setState({ activeCatalog: target.getAttribute('href').slice(1) });
	}

	handlePraise = (type,isPraise,subjectId,event) => {
		let data = {
			uid: sessionStorage.getItem('uid'),
			type: type,
			subjectId:subjectId
		}
		let rquestMode = isPraise ? 'post' : 'delete';
		let url = blogGlobal.requestBaseUrl + '/praise';
		if(type === 0){//文章点赞
			let newPraiseUser = this.state.praiseUser;
			if(isPraise){
				newPraiseUser.push(loginUid)
				
			}else{
				let index = this.state.praiseUser.indexOf(loginUid);
				if(index >= 0){
					newPraiseUser.splice(index,1);
				}
			}
			this.setState({praiseUser:newPraiseUser}) 
		}
		this.sendRequest(url, rquestMode, data, (json) => {
			console.log(json);
			if(type === 1){
				this.fetchComments();
			}
		})
	}

	handleCollection = (isCollection, subjectId, event) => {
		let data = {
			uid: sessionStorage.getItem('uid'),
			subjectId:subjectId
		}
		let rquestMode = isCollection ? 'post' : 'delete';
		let url = blogGlobal.requestBaseUrl + '/collection';
		let newCollectionUser = this.state.collectionUser;
		if(isCollection){
			newCollectionUser.push(loginUid)
		}else{
			let index = this.state.collectionUser.indexOf(loginUid);
			if(index >= 0){
				newCollectionUser.splice(index,1);
			}
		}
		this.setState({collectionUser:newCollectionUser});
		this.sendRequest(url, rquestMode, data, (json) => {
			console.log(json);
		})
	}

	handleBackTop = () => {
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
	}

	handleReply = (index, item, event) => {
		this.setState({ replyIndex: index });
		setTimeout(() => {
			this.setState({replayUser:item.fromUsername})
			this.refs.reply.focus();
			this.refs.reply.dataset.touid = item.fromUid;
			this.refs.reply.dataset.touname = item.fromUsername;
			if(item.parentId){
				this.refs.reply.dataset.pid = item.parentId;
			}else{
				this.refs.reply.dataset.pid = item._id;
			}
		}, 200)
	}

	handleCommentChange = () => {
		this.setState({isCommentError:false});
	}

	handleReplyChange = () => {
		this.setState({isReplyError:false});
	}

	fetchComments = () => {
		let url = blogGlobal.requestBaseUrl + '/comments?articleId=' + this.props.match.params.articleId;
		this.sendRequest(url, 'get', null, (json) => {
			console.log(json);
			let { commentList, replyList } = json;
			let newCommentList = [];
			for (let comment of commentList) {
					comment.replyList = [];
					for (let item of replyList) {
						if (item.parentId == comment._id) {
							comment.replyList.push(item);
						}
					}
					newCommentList.push(comment);
			}
			this.setState({ commentList: newCommentList,commentTotal: commentList.length});
		})
	}

	comfirmComment = (mode, event) => {
		let data = {
			fromUsername: sessionStorage.getItem('username'),
			fromUid: sessionStorage.getItem('uid'),
			articleId: this.props.match.params.articleId
		}
		let reg = /^\s*$/
		if (mode === 'comment') {
			data.content = this.refs.comment.value;
			if(reg.test(data.content)){
				this.setState({isCommentError:true});
				this.refs.comment.focus();
				return;
			}
			console.log(data)
			this.refs.comment.value = '';
		} else {
			data.content = this.refs.reply.value;
			if(reg.test(data.content)){
				this.setState({isReplyError:true});
				this.refs.reply.focus();
				return;
			}
			data.toUsername = this.refs.reply.dataset.touname;
			data.toUid = this.refs.reply.dataset.touid;
			data.parentId = this.refs.reply.dataset.pid || null;
			console.log(data)
			this.refs.reply.value = '';
		}
		let url = blogGlobal.requestBaseUrl + '/comments';
		this.sendRequest(url, 'post', data, (json) => {
			console.log(json);
			this.fetchComments();
			this.setState({replyIndex:-1});
		})
	}

	//发送请求mode: post--新建评论
	sendRequest = (url, mode, data, callback) => {
		fetch(url, {
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

	getOffset = (obj) => {
		let top = 0, left = 0;
		while (obj) {
			top += obj.offsetTop;
			left += obj.offsetLeft;
			obj = obj.offsetParent;
		}
		return { "top": top, "left": left };
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


	render() {
		let { catalog, article, content, praiseUser, collectionUser, commentTotal, sidebarShow, activeCatalog, fixed, commentList, replyIndex, replayUser, isCommentError, isReplyError} = this.state;
		let tagArr = article ? article.tag.split(';') : [];
		tagArr.pop();
		let tagProps = { isLink: true, hasClose: false, list: tagArr };
		return (
			<article styleName="root" className="clearfix">
				<header styleName="header" className="clearfix">
					<div className="fl">
						<h1 styleName="title">{article ? article.title : ''}</h1>
						<div>
							<Tag {...tagProps} />
						</div>
					</div>
					<div className="fr" styleName="extra-info">
						<div styleName="browse-times"><strong>{article ? article.scan : 1}</strong>&nbsp;次浏览</div>
						<time styleName="date">{article ? moment(article.publicTime).format('YYYY-MM-DD') : ''}</time>
					</div>
				</header>
				<section styleName="content-container" className="clearfix">
					<div className="fl" style={{ width: sidebarShow ? '900px' : '100%' }} >
						<div ref="content" styleName="content" className="markdown" dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
						<div styleName="relative-info">
							<div styleName="reward">
								<p>如果觉得我的文章对你有用，请随意扫码赞赏</p>
								<img href="#" />
							</div>
							<div styleName="relative-link" className="clearfix">
								<a className="fl"><i className="fa fa-chevron-left"></i>&nbsp;上一篇</a>
								<a className="fr">下一篇&nbsp;<i className="fa fa-chevron-right"></i></a>
							</div>
						</div>
						<div styleName="comment">
							<ul>
								{
									commentList.map((item, index) => {
										return (
											<li styleName="comment-item" className="clearfix" key={index}>
												<div className="fl" data-userid={item.fromUid} data-username={item.fromUsername}><img src={require('../images/logo.jpg')} className="avatar" /></div>
												<div styleName="comment-content">
													<div styleName="comment-info" className="clearfix">
														<div className="fl" styleName="user-info">
															<strong>{item.fromUid === sessionStorage.getItem('uid') ? '我' : item.fromUsername}</strong>
															{item.fromUsername === 'admin' ? <span>作者</span> : null}
															<time>{this.getDateDiff(item.createTime)}</time>
														</div>
														<div className="fr" styleName="operate">
															{item.praiseUser.includes(loginUid) ? 
																<span onClick={this.handlePraise.bind(this,1,false,item._id)}><i className="fa fa-thumbs-up"></i>赞<em>({item.praiseUser.length})</em></span> : 
																<span onClick={this.handlePraise.bind(this,1,true,item._id)}><i className="fa fa-thumbs-o-up"></i>赞<em>({item.praiseUser.length})</em></span>
															}
															<span onClick={this.handleReply.bind(this, index, item)}><i className="fa fa-reply"></i>回复</span>
														</div>
													</div>
													<div styleName="comment-detail">{item.content}</div>
													<ul>
														{
															item.replyList.map((ritem, rindex) => {
																return (
																	<li key={rindex + 'r'}>
																		<div className="fl" data-userid={ritem.fromUid} data-username={ritem.fromUsername}><img src={require('../images/logo.jpg')} className="avatar" /></div>
																		<div styleName="comment-content">
																			<div styleName="comment-info" className="clearfix">
																				{
																					ritem.fromUid === ritem.toUid ? 
																					<div className="fl" styleName="user-info">
																						<strong>{ritem.fromUid === sessionStorage.getItem('uid') ? '我' : ritem.fromUsername}</strong>
																						{ritem.fromUsername === 'admin' ? <span>作者</span> : null}
																						<time>{this.getDateDiff(ritem.createTime)}</time>
																					</div> : 
																					<div className="fl" styleName="user-info">
																						<strong>{ritem.fromUid === sessionStorage.getItem('uid') ? '我' : ritem.fromUsername}</strong>
																						{ritem.fromUsername === 'admin' ? <span>作者</span> : null}
																						<i>@</i>
																						<strong>{ritem.toUid === sessionStorage.getItem('uid') ? '我' : ritem.toUsername}</strong>
																						{ritem.toUsername === 'admin' ? <span>作者</span> : null}
																						<time>{this.getDateDiff(ritem.createTime)}</time>
																					</div>
																				}
																				{
																					ritem.fromUid === sessionStorage.getItem('uid') ? null : <div className="fr" styleName="operate">
																						{ritem.praiseUser.includes(loginUid) ? 
																							<span onClick={this.handlePraise.bind(this,1,false,ritem._id)}><i className="fa fa-thumbs-up"></i>赞<em>({ritem.praiseUser.length})</em></span> : 
																							<span onClick={this.handlePraise.bind(this,1,true,ritem._id)}><i className="fa fa-thumbs-o-up"></i>赞<em>({ritem.praiseUser.length})</em></span>
																						}
																						<span onClick={this.handleReply.bind(this, index, ritem)}><i className="fa fa-reply"></i>回复</span>
																					</div>
																				}
																			</div>
																			<div styleName="comment-detail">{ritem.content}</div>
																		</div>
																	</li>
																)
															})
														}
													</ul>
													{
														replyIndex === index ? <div styleName="comment-form-wrap">
															<div styleName="replay-userinfo">{'@'+replayUser}</div>
															<div styleName="comment-form">
																<button className="btn-normal fr" onClick={this.comfirmComment.bind(this, 'reply')}>回复</button>
																<div className="over-hidden">
																	<textarea ref="reply" placeholder="在此输入回复，请文明用语" styleName={isReplyError && 'error'} onChange={this.handleReplyChange}></textarea>
																</div>
															</div>
														</div> : null
													}
												</div>
											</li>
										)
									})
								}
							</ul>
							<div styleName="add-comment" id="comment">
								<div className="fl" styleName="avatar"><img src={require('../images/logo.jpg')} className="avatar" /></div>
								<div styleName="comment-form">
									<button className="btn-normal fr" onClick={this.comfirmComment.bind(this, 'comment')}>评论</button>
									<div className="over-hidden">
										<textarea ref="comment" placeholder="在此输入评论，请文明用语" styleName={isCommentError && 'error'} onChange={this.handleCommentChange}></textarea>
									</div>
								</div>
							</div>
						</div>
					</div>
					<aside styleName="sidebar" className={fixed ? 'fl' : 'fl absolute'} style={{ display: sidebarShow ? 'block' : 'none' }}>
						<div styleName="catalog" className={fixed ? 'fixed' : ''} ref="catalog">
							<h2>目录</h2>
							{this.renderMenu(catalog, activeCatalog)}
						</div>
					</aside>
				</section>
				<ul styleName="toolbar">
					{praiseUser.includes(loginUid) ? 
						<li styleName="toolbar-item" title="赞一个" onClick={this.handlePraise.bind(this, 0, false, this.props.match.params.articleId)}><i className="fa fa-thumbs-up"></i><span>{praiseUser.length}</span></li> : 
						<li styleName="toolbar-item" title="赞一个" onClick={this.handlePraise.bind(this, 0, true, this.props.match.params.articleId)}><i className="fa fa-thumbs-o-up" styleName="pre-operate"></i><i className="fa fa-thumbs-up" styleName="operated"></i><span>{praiseUser.length}</span></li>}
					{collectionUser.includes(loginUid) ? 
						<li styleName="toolbar-item" title="收藏" onClick={this.handleCollection.bind(this, false, this.props.match.params.articleId)}><i className="fa fa-bookmark"></i><span>{collectionUser.length}</span></li> : 
						<li styleName="toolbar-item" title="收藏" onClick={this.handleCollection.bind(this, true, this.props.match.params.articleId)}><i className="fa fa-bookmark-o" styleName="pre-operate"></i><i className="fa fa-bookmark" styleName="operated"></i><span>{collectionUser.length}</span></li>}
					<li styleName="toolbar-item"  title="评论"><a href="#comment"><i className="fa fa-commenting-o" styleName="pre-operate"></i><i className="fa fa-commenting" styleName="operated"></i><span>{commentTotal}</span></a></li>
				</ul>
				<div className="fa fa-chevron-up" styleName="backtop" title="回到顶部" onClick={this.handleBackTop}></div>
			</article>
		)
	}
}
export default CSSModules(Article, style, { allowMultiple: true, handleNotFoundStyleName: 'log' });