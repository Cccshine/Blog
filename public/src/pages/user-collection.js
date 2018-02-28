import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import moment from 'moment';
import marked from 'marked';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/user.scss';
import blogGlobal from '../data/global';

class Collection extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			collectionArticles:[]
		}
	}

	componentWillMount = () => {
		let url = blogGlobal.requestBaseUrl + "/articles?mode=collection&userId=" + sessionStorage.getItem('uid');
		fetch(url, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
			let { collectionArticles } = json;
			this.setState({ collectionArticles: collectionArticles});
		}).catch((err) => {
			console.log(err);
		});
	}

	render(){
		let {collectionArticles} = this.state;
		let tagProps = { isLink: true, hasClose: false };
		return(
			<div styleName="profile-active-list">
				{
					collectionArticles.map((item, index) => {
						let list = item.tag.split(';');
						list = list.slice(0, list.length - 1);
						return(
							<section styleName="list-item" key={index}>
						      	<div styleName="list-item-content">
						      		<div className="clearfix">
						      			<h3 className="fl"><Link target="_blank" to={"/articles/" + item._id}>{item.title}</Link></h3>
					      			</div>
					      			<div styleName="tag-panel">
					      				<Tag {...tagProps} list={list} />
				      				</div>
				      				<div styleName="summary">
				      					<p dangerouslySetInnerHTML={{ __html: marked(item.summary) }}></p>
			      					</div>
			      					<div className="clearfix">
			      						<div styleName="article-info" className="fl">
			      							<div><i className="fa fa-thumbs-up"></i><span>赞({item.praiseUser.length})</span></div>
											<div><i className="fa fa-bookmark"></i><span>收藏({item.collectionUser.length})</span></div>
											<div><i className="fa fa-commenting"></i><span>评论({item.commentTotal})</span></div>
										</div>
										<div styleName="more" className="fr"><Link target="_blank" to={"/articles/"  + item._id}>阅读全文</Link></div>
									</div>
								</div>
							</section>
						)
					})
				}
			</div>
		)
	}
}
export default CSSModules(Collection, style, { handleNotFoundStyleName: 'log' });