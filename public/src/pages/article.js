import React from 'react';
import marked from 'marked';
import Highlight from 'highlight.js';
import moment from 'moment';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/article.scss';
import blogGlobal from '../data/global';

let eHeadings = null,headingsOffset=[];//存储所有的h1,h2,h3标签及其距离顶部的距离
let catalogChangeDis = 0;
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
			sidebarShow: true,
			article: null,
			activeCatalog: "",
			fixed: false
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
		this.setState({ catalog: newTitle,activeCatalog: newTitle[0].eleId});
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
				<li key={menuList.eleId} styleName={('title-level-' + menuList.level) + (this.state.activeCatalog ===  menuList.eleId ? ' active' : '')}>
					<a href={'#' + menuList.eleId} onClick={this.handleCatalogClick}>
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
		let url = blogGlobal.requestBaseUrl + "/articles?mode=detail&articleId=" + this.props.match.params.articleId;
		fetch(url, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
			this.setState({ article: json.article, content: json.article.content });
			this.createCatalog(this.refs.content.innerHTML);
			eHeadings = document.getElementsByClassName('heading');
			for(let ele of eHeadings){
				let item = {
					"top":this.getOffset(ele).top,
					"anchorId":ele.getAttribute('id')
				}
				headingsOffset.push(item);
			}
			headingsOffset.reverse();
			catalogChangeDis = this.getOffset(this.refs.content).top;
		}).catch((err) => {
			console.log(err);
		});
		window.addEventListener('scroll', this.changeCatalog, false);
	}

	componentWillUnmount = () => {
		window.removeEventListener('scroll', this.changeCatalog, false);
	}

	changeCatalog = (event) => {
		let scroll = document.documentElement.scrollTop || document.body.scrollTop;
		if(scroll > catalogChangeDis){
			this.setState({fixed:true});
		}else{
			this.setState({fixed:false});
		}
		for(let item of headingsOffset){
			if(scroll >= item.top){
				if(this.state.activeCatalog != item.anchorId){
					console.log('yy')
					this.setState({activeCatalog:item.anchorId});
				}
				break;
			}
		}
	}

	handleCatalogClick = (event) => {
		let target = event.target;
		if(event.target.nodeName.toLowerCase() !== 'a'){
			target = event.target.parentNode;
		}
		this.setState({activeCatalog:target.getAttribute('href').slice(1)});
	}

	comfirmComment = (mode, event) => {
		let data = {
			fromUsername:sessionStorage.getItem('username'),
			fromUid:sessionStorage.getItem('uid'),
			articleId:this.props.match.params.articleId
		}
		if(mode === 'comment'){
			data.content = this.refs.comment.value;
			console.log(data)
		}else{
			data.toUsername = 
			data.toUid = 
			data.content = this.refs.replay.value;
			console.log(data)
		}
		this.sendRequest('post',data, (json) => {
			console.log(json);
		})
	}

	//发送请求mode: post--新建评论
	sendRequest = (mode, data, callback) => {
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
		let top = 0,left = 0;
		while (obj) {
			top += obj.offsetTop;
			left += obj.offsetLeft;
			obj = obj.offsetParent;
		}
		return {"top":top,"left":left};
	}

	render() {
		let { catalog, article, content, sidebarShow, activeCatalog, fixed } = this.state;
		let tagArr = article ? article.tag.split(';') : [];
		tagArr.pop();
		let tagProps = { isLink: true, hasClose: false, list: tagArr };
		return (
			<article styleName="root" className="clearfix">
				<header styleName="header" className="clearfix">
					<div className="fl">
						<h1 styleName="title">{article ? article.title : ''}</h1>
						<div styleName="tag-panel">
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
								<li styleName="comment-item" className="clearfix">
									<div className="fl"><img src={require('../images/logo.jpg')} className="avatar"/></div>
									<div styleName="comment-content">
										<div styleName="comment-info" className="clearfix">
											<div className="fl" styleName="user-info">
												<strong>cshine</strong>
												<span>作者</span>
												<time>一天前</time>
											</div>
											<div className="fr" styleName="operate">
												<span onClick={this.handlePraise}><i className="fa fa-thumbs-o-up"></i>赞<em>+6</em></span>
												<span onClick={this.handleReply}><i className="fa fa-reply"></i>回复</span>
											</div>
										</div>
										<div styleName="comment-detail">从业十余年仍然能保持一份对技术的初心</div>
										<ul styleName="replay-list">
											<li styleName="replay-item">
												<div className="fl"><img src={require('../images/logo.jpg')} className="avatar"/></div>
												<div styleName="comment-content">
													<div styleName="comment-info" className="clearfix">
														<div className="fl" styleName="user-info">
															<strong>cc</strong>
															<span>作者</span>
															<i>@</i>
															<strong>cc</strong>
															<time>一天前</time>
														</div>
														<div className="fr" styleName="operate">
															<span onClick={this.handlePraise}><i className="fa fa-thumbs-o-up"></i>赞<em>+6</em></span>
															<span onClick={this.handleReply}><i className="fa fa-reply"></i>回复</span>
														</div>
													</div>
													<div styleName="comment-detail">谢谢夸奖</div>
												</div>
											</li>
										</ul>
										<div styleName="comment-form">
											<button className="btn-normal fr">回复</button>
											<div className="over-hidden">
												<textarea ref="replay" placeholder="在此输入回复，请文明用语"></textarea>
											</div>
										</div>
									</div>
								</li>
							</ul>
							<div styleName="add-comment">
								<div className="fl" styleName="avatar"><img src={require('../images/logo.jpg')} className="avatar"/></div>
								<div styleName="comment-form">
								<button className="btn-normal fr" onClick={this.comfirmComment.bind(this,'comment')}>评论</button>
								<div className="over-hidden">
									<textarea ref="comment" placeholder="在此输入评论，请文明用语"></textarea>
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
			</article>
		)
	}
}
export default CSSModules(Article, style, { allowMultiple: true, handleNotFoundStyleName: 'log' });