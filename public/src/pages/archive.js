import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/archive.scss';
import blogGlobal from '../data/global';

class Archive extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: 0,//0--正在获取 1--获取成功 2--暂无文章
			archiveList: []
		}
	}
	componentWillMount = () => {
		let time = this.props.match.params.time || null;
		console.log(HTMLTimeElement)
		if(time){
			let realTime = time.slice(0,4) + '-' + time.slice(4)
			let startTime = moment(realTime).format('x');
			let endTime = moment(1512057600000).add(1,'months').format('x');
			console.log(startTime,endTime)
		}else{
			let url = blogGlobal.requestBaseUrl + "/articles?mode=archive";
			fetch(url, {
				method: 'get',
				mode: 'cors',
				credentials: 'include',
			}).then((response) => {
				return response.json();
			}).then((json) => {
				let { status, archiveList } = json;
				this.setState({ status: status, archiveList: archiveList });
				console.log(json);
			}).catch((err) => {
				console.log(err);
			});
		}
	}

	render() {
		let { status, archiveList } = this.state;
		return (
			<div styleName="root">
				{
					(() => {
						switch (status) {
							case 1:
								return (
									<ul styleName="archive-list">
										{
											archiveList.map((item, index) => {
												return (
													<li key={index} styleName="archive-item">
														<Link target="_blank" to={"/archive/" + item._id}>{item._id.slice(0,4)}年{item._id.slice(4)}月</Link>
														<span styleName="sum">{item.total}</span>
													</li>
												)
											})
										}
									</ul>
								)
								break;
							case 2:
								return <h3 styleName="null-tip">暂无文章</h3>
								break;
							default:
								return <div styleName="loading"><i className="fa fa-spinner fa-pulse"></i><span>正在加载...</span></div>
								break;
						}
					})()
				}
			</div>
		)
	}
}

export default CSSModules(Archive, style, { handleNotFoundStyleName: 'log' });