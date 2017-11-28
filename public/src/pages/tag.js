import React from 'react';
// import CSSModules from 'react-css-modules';
// import style from '../sass/pages/write.scss';
import blogGlobal from '../data/global';

export default class Tag extends React.Component{
	constructor(props){
		super(props);
		console.log(props)
	}

	componentWillMount = () => {
		let url = blogGlobal.requestBaseUrl + "/articles?mode=public&tagName=" + this.props.match.params.tagName;
		fetch(url, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
			let { status, articleList } = json;
			if (status == 0) {
				this.setState({ status: 2 });
			} else if (status == 1) {
				this.setState({ status: 1, summaryList: articleList });
			}
		}).catch((err) => {
			console.log(err);
		});
	}

	render(){
		return(
			<h1>{this.props.match.params.tagName}</h1>
		)
	}
}