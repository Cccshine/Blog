import React from 'react';

export default class Article extends React.Component{
	constructor(props){
		super(props);
	}
	// handleClick = (event) => {
	// 	let url = "http://localhost:4000/list";
 //        fetch(url, {
 //          method: 'GET',
 //          headers: {
 //            'Accept': 'application/json',
 //    		'Content-Type': 'application/json'
 //          },
 //          mode:'cors',
 //          credentials: 'include'
 //        }).then((response) => {
 //        		console.log(response.text())
 //            }
 //        ).catch((err) => {
 //        	 console.log(err)
 //        })
	// }
	render(){
		return(
			<h1>我是文章列表页</h1>
		)
	}
}