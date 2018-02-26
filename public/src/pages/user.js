import React from 'react';
import {Route,Switch} from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';
import moment from 'moment';
import marked from 'marked';
import Modal from '../component/modal/modal';
import Tag from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/user.scss';
import blogGlobal from '../data/global';
import Activity from './activity.js';
import Collection from './collection.js';
import ThumbUp from './thumbs-up.js';
import NoMatch from './nomatch.js';

class User extends React.Component{
	constructor(props){
		super(props);
	}

	componentWillMount = () => {
		this.props.history.push({ pathname: '/user/activities'});
	}

	render(){
		let tagProps = { isLink: true, hasClose: false };
		let list = ["css","html"]
		return(
			<div styleName="root">
				<header className="clearfix" styleName="profile-header">
					<div className="fl" styleName="user-info">
						<img className="fl" src={require('../images/logo.jpg')}  alt="cshine"/>
						<h3 className="fl">Cshine</h3>
					</div>
					<div className="fr" styleName="btn-group">
						<button className="btn-normal btn-md">设置</button>
					</div>
				</header>
				<div styleName="profile-main">
					<nav styleName="profile-tabs" className="profile-tabs">
						<NavLink to="/user/activities" activeClassName="active-tab">动态</NavLink>
						<NavLink to="/user/collections" activeClassName="active-tab">收藏</NavLink>
						<NavLink to="/user/thumbs-up" activeClassName="active-tab">点赞</NavLink>
					</nav>
					<div>
						<Switch>
							<Route path="/user/collections" component={Collection}/>
							<Route path="/user/thumbs-up" component={ThumbUp}/>
							<Route path="/user" component={Activity}/>
							<Route component={NoMatch}/>
					    </Switch>
					</div>
				</div>
			</div>
		)
	}
}
export default CSSModules(User, style, { handleNotFoundStyleName: 'log' });