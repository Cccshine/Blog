import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import moment from 'moment';
import marked from 'marked';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/user.scss';
import blogGlobal from '../data/global';

class Activity extends React.Component{
	constructor(props){
		super(props);
	}

	componentWillMount = () => {
		
	}

	render(){
		let tagProps = { isLink: true, hasClose: false };
		let list = ["css","html"]
		return(
			<div styleName="profile-active-list">
				<section styleName="list-item">
					<div styleName="list-item-meta">收藏了文章（刚刚）</div>
					<div styleName="list-item-content">
						<div className="clearfix">
							<h3 className="fl"><Link target="_blank" to={"/articles/" + '1'}>xxxxxx</Link></h3>
						</div>
						<div styleName="tag-panel">
							<Tag {...tagProps} list={list} />
						</div>
						<div styleName="summary">
							<p dangerouslySetInnerHTML={{ __html: marked('svdchgdvchsddddcdfvhdfv') }}></p>
						</div>
						<div className="clearfix">
							<div styleName="article-info" className="fl">
								<div><i className="fa fa-thumbs-up"></i><span>赞(5)</span></div>
								<div><i className="fa fa-bookmark"></i><span>收藏(5)</span></div>
								<div><i className="fa fa-commenting"></i><span>评论(5)</span></div>
							</div>
							<div styleName="more" className="fr"><Link target="_blank" to={"/articles/" + '1'}>阅读全文</Link></div>
						</div>
					</div>
				</section>
				<section styleName="list-item">
					<div styleName="list-item-meta">点赞了文章（三天前）</div>
					<div styleName="list-item-content">
						<div className="clearfix">
							<h3 className="fl"><Link target="_blank" to={"/articles/" + '1'}>xxxxxx</Link></h3>
						</div>
						<div styleName="tag-panel">
							<Tag {...tagProps} list={list} />
						</div>
						<div styleName="summary">
							<p dangerouslySetInnerHTML={{ __html: marked('svdchgdvchsddddcdfvhdfv') }}></p>
						</div>
						<div className="clearfix">
							<div styleName="article-info" className="fl">
								<div><i className="fa fa-thumbs-up"></i><span>赞(5)</span></div>
								<div><i className="fa fa-bookmark"></i><span>收藏(5)</span></div>
								<div><i className="fa fa-commenting"></i><span>评论(5)</span></div>
							</div>
							<div styleName="more" className="fr"><Link target="_blank" to={"/articles/" + '1'}>阅读全文</Link></div>
						</div>
					</div>
				</section>
			</div>
		)
	}
}
export default CSSModules(Activity, style, { handleNotFoundStyleName: 'log' });