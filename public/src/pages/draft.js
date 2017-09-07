import React from 'react';
import marked from 'marked';
import Tag from '../component/tag/tag';
import Select from '../component/select/select';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/draft.scss'

class Draft extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			editor:'',
			previewer:{__html:''},
			tagString:'',
			list:[]
		}
	}

	handleEditorChange = (event) => {
		let value = event.target.value;
		this.setState({editor:value,previewer:{__html:marked(value)}});
	}

	handleTagChange = (event) => {
		let value = event.target.value;
		if(value.indexOf(';') > 0){
			this.setState({tagString:this.state.tagString + value});
			event.target.value = '';
		}
	}

	//传给子组件Tag的回调函数
	handleTagDelete = (event) => {
		let index  = event.target.parentNode.dataset.index;
		let list = this.state.tagString.split(';');
		list.splice(index,1);
		let newTagSting = list.join(';');
		this.setState({tagString:newTagSting});
	}

	handleQuitDraft = () => {

	}

	handlePublic = () => {
		
	}

	render(){
		let {editor,previewer,tagString} = this.state;
		let list = tagString.split(';');
		list.splice(list.length - 1,1);
		let tagProps ={list:list,hasClose:true,handleTagDelete:this.handleTagDelete};
		return(
			<div styleName="new-file">
				<div className="clearfix">
					<Select list={['原创','转载','翻译']} />
					<div styleName="tag-bar-wrap">
						<Tag  {...tagProps}/>
						<input type="text" onChange={this.handleTagChange}/>
					</div>
					<div styleName="btn-group">
						<button className="btn-normal" onClick={this.handleQuitDraft}>舍弃草稿</button>
						<button className="btn-normal" onClick={this.handlePublic}>发布文章</button>
					</div>
				</div>
				<div styleName="editor">
					<header styleName="header">编辑区</header>
					<textarea onChange={this.handleEditorChange} placeholder="请在此开始你的文章">

					</textarea>
				</div>
				<div styleName="previewer">
					<header styleName="header">预览区</header>
					<div dangerouslySetInnerHTML={this.state.previewer}></div>
				</div>
			</div>
		)
	}
}

export default CSSModules(Draft, style,{handleNotFoundStyleName:'log'});