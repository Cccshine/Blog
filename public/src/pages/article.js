import React from 'react';
import marked from 'marked';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/article.scss';
import blogGlobal from '../data/global';
 

const content = `

# Header 1

## Header 2`

class Article extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			catalog:[]
		}
	}
	createCatalog = (html) => {
		let originTitle = html.match(/<(h[1-6]{1})[^>]*>(.*?)<\/h[1-6]{1}>/g);
		let newTitle = [];
		originTitle.map((item, index) => {
			let level = item.substr(2,1);
			let id = item.match(/id="(.*?)"/)[1];
			let label = item.match(/>(.*?)</)[1];
			newTitle.push({level:level,id:id,label:label});
		});
		this.setState({catalog:newTitle});
	}
	componentDidMount = () => {
		this.createCatalog(this.refs.content.innerHTML)
	}
	render(){
		let {catalog} = this.state;
		let tagProps = {isLink:true,hasClose:false,list:['html','css']};
		return(
			<article styleName="root" className="clearfix">
				<header styleName="header" className="clearfix">
					<div className="fl">
						<h1 styleName="title">first article</h1>
						<div styleName="tag-panel">
							<Tag {...tagProps}/>
						</div>
					</div>
					<div className="fr" styleName="extra-info">
						<div styleName="browse-times"><strong>1k</strong>&nbsp;次浏览</div>
						<div styleName="date">2017-9-4</div>
					</div>
				</header>
				<section styleName="content-container" className="fl">
					<div ref="content" styleName="content" dangerouslySetInnerHTML={{__html:marked(content)}}></div>
					<div styleName="comment">
						<li>1</li>
						<li>2</li>
						<li>3</li>
					</div>
				</section>
				<aside styleName="sidebar" className="fl" ref="catalog">
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