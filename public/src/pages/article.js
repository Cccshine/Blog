import React from 'react';
import marked from 'marked';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/article.scss';
import blogGlobal from '../data/global';

class Article extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		let tagProps = {isLink:true,hasClose:false,list:['html','css']};
		return(
			<div styleName="root">
				<article styleName="content-box">
					<h1 styleName="title">first article</h1>
					<div styleName="tag-panel">
						<Tag {...tagProps}/>
					</div>
					<div styleName="date">2017-9-4</div>
					<div styleName="content" dangerouslySetInnerHTML={{__html:marked("## 这是第一篇博文")}}></div>
				</article>
				<div styleName="comment-box"></div>
			</div>
		)
	}
}
export default CSSModules(Article, style,{handleNotFoundStyleName:'log'});