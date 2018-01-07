import React from 'react';
import blogGlobal from '../data/global';

export default class Archive extends React.Component{
	constructor(props){
		super(props);
	}
	componentWillMount = () => {
		let url = blogGlobal.requestBaseUrl + "/articles?mode=archive";
		fetch(url, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
		}).catch((err) => {
			console.log(err);
		});
	}

	render(){
		return(
			<h1>我是归档页</h1>
		)
	}
}