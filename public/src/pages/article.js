import React from 'react';
import marked from 'marked';
import Highlight from 'highlight.js';
import moment from 'moment';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/article.scss';
import blogGlobal from '../data/global';

let rendererMD = new marked.Renderer();
rendererMD.heading = function (text, level) {
	return '<h' + level + ' id=' + text + '>' + text + '</h' + level + '>';
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
			activeCatalog: ""
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
			this.createCatalog(this.refs.content.innerHTML)
			console.log(this.state.article)
		}).catch((err) => {
			console.log(err);
		});
	}
	componentDidMount = () => {
		// this.createCatalog(this.refs.content.innerHTML)
	}
	handleCatalogClick = (event) => {
		let target = event.target;
		if(event.target.nodeName.toLowerCase() !== 'a'){
			target = event.target.parentNode;
		}
		this.setState({activeCatalog:target.getAttribute('href').slice(1)});
	}

	render() {
		let { catalog, article, content, sidebarShow, activeCatalog } = this.state;
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
						<div styleName="date">{article ? moment(article.publicTime).format('YYYY-MM-DD') : ''}</div>
					</div>
				</header>
				<section styleName="content-container" className="clearfix">
					<div ref="content" styleName="content" className="fl markdown" style={{ width: sidebarShow ? '900px' : '100%' }} dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
					<aside styleName="sidebar" className="fl" ref="catalog" style={{ display: sidebarShow ? 'block' : 'none' }}>
						<h2>目录</h2>
						{this.renderMenu(catalog, activeCatalog)}
					</aside>
				</section>
				<div styleName="comment">
					
					<li>1</li>
					<li>2</li>
					<li>3</li>
				</div>
			</article>
		)
	}
}
export default CSSModules(Article, style, { allowMultiple: true, handleNotFoundStyleName: 'log' });