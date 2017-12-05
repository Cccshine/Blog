import React from 'react';
import marked from 'marked';
import moment from 'moment';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/article.scss';
import blogGlobal from '../data/global';

let content = null;
let catalog = null;
class Article extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			catalog:[],
			content:"",
			sidebarShow: true,
			article: null
		}
	}
	createCatalog = (html) => {
		let originTitle = html.match(/<(h[1-6]{1})[^>]*>(.*?)<\/h[1-6]{1}>/g);
		let newTitle = [];
		//todo --- originTitle为null的处理
		if(!originTitle){
			this.setState({sidebarShow:false});
			return;
		}
		originTitle.map((item, index) => {
			let level = item.substr(2,1);
			let id = item.match(/id="(.*?)"/)[1];
			let label = item.match(/>(.*?)</)[1];
			newTitle.push({level:level,id:id,label:label});
		});
		this.setState({catalog:newTitle});
	}
	componentWillMount = () => {
		let url = blogGlobal.requestBaseUrl+"/articles?mode=detail&articleId="+this.props.match.params.articleId;
		fetch(url,{
			method:'get',
		    mode:'cors',
		    credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
			this.setState({article:json.article,content:json.article.content});
			this.createCatalog(this.refs.content.innerHTML)
			console.log(this.state.article)
		}).catch((err) => {
			console.log(err);
		});
	}
	componentDidMount = () => {
		// this.createCatalog(this.refs.content.innerHTML)
	}
	render(){
		let {catalog,article,content,sidebarShow} = this.state;
		let tagArr = article ? article.tag.split(';') : [];
		tagArr.pop();
		let tagProps = {isLink:true,hasClose:false,list:tagArr};
		return(
			<article styleName="root" className="clearfix">
				<header styleName="header" className="clearfix">
					<div className="fl">
						<h1 styleName="title">{article ? article.title : ''}</h1>
						<div styleName="tag-panel">
							<Tag {...tagProps}/>
						</div>
					</div>
					<div className="fr" styleName="extra-info">
						<div styleName="browse-times"><strong>1k</strong>&nbsp;次浏览</div>
						<div styleName="date">{article ? moment(article.publicTime).format('YYYY-MM-DD') : ''}</div>
					</div>
				</header>
				<section styleName="content-container" className="fl" style={{width: sidebarShow ? '900px' : '100%'}}>
					<div ref="content" styleName="content" dangerouslySetInnerHTML={{__html:marked(content)}}></div>
					<div styleName="comment">
						<li>1</li>
						<li>2</li>
						<li>3</li>
					</div>
				</section>
				<aside styleName="sidebar" className="fl" ref="catalog" style={{display:sidebarShow ? 'block' : 'none'}}>
					<ul>
						{
							catalog.map((item,index) => {
								return (
									<li key={index} className={'title-level-' + item.level}>
										<a href={'#'+item.id}>
											<span>{item.label}</span>
										</a>
									</li>
								)
							})
						}
					</ul>
				</aside>
			</article>
		)
	}
}
export default CSSModules(Article, style,{handleNotFoundStyleName:'log'});