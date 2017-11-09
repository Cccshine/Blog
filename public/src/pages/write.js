import React from 'react';
import marked from 'marked';
import Tag from '../component/tag/tag';
import Select from '../component/select/select';
import TipBar from '../component/tipBar/tip-bar';
import Modal from '../component/modal/modal';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/write.scss'
import blogGlobal from '../data/global';

const url = blogGlobal.requestBaseUrl+"/articles";
let timer = null;
let articleID = null;

class Write extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			title:'',
			editor:'',
			previewer:{__html:''},
			tagString:'',
			selectIsDown:false,
			selectText:'原创',
			selectValue:0,
			tipType:'',
			showTip:false,
			tipText:'',
			showModal:false,
			isPublic: false //是否已发表（true--已发表的文章再来编辑  false--新建的文章或者草稿来编辑）
		}
	}

	componentWillMount = () => {
		let order = this.props.match.params.order || null;
		if (!order)
			return;
		fetch(url+'?mode=edit&order='+order, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
			let { status, article } = json;
			articleID = article._id;
			this.setState({
				isPublic:article.isPublic,
				editor:article.content,
				previewer:{__html:marked(article.content)},
				title:article.title,
				tagString:article.tag,
				selectValue:article.type
			});
		}).catch((err) => {
			console.log(err);
		});
	}

	handleEditorChange = (event) => {
		let value = event.target.value;
		this.setState({editor:value,previewer:{__html:marked(value)}});
		if(!timer){
			timer = setTimeout(() => {
				this.saveAsDraft(true);
				timer = null;
			},5000)
		}
	}
	handleTitleChange = (event) =>{
		this.setState({title:event.target.value});
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
		let newTagString = list.join(';');
		this.setState({tagString:newTagString});
	}
	//传给子组件Select的回调函数
	handleSelect = (event) => {
		this.setState({selectIsDown:false,selectText:event.target.innerText,selectValue:event.target.dataset.value});
	}

	handleSaveAsDraft = (event) => {
		this.saveAsDraft(false);
	}

	handleQuitDraft = (event) => {
		let {editor,title,tagString,selectValue} = this.state;
		if(!articleID){
			this.setState({showTip:true,tipType:'error',tipText:'该文章暂未保存到草稿箱'});
			this.hideTip();
			return;
		}
		this.setState({showModal:true});

	}

	handlePublic = (event) => {
		let {editor,title,tagString,selectValue} = this.state;
		if(title.trim() === ''){
			this.setState({showTip:true,tipType:'error',tipText:'标题不能为空'});
			this.hideTip();
			return;
		}else if(editor.trim() == ''){
			this.setState({showTip:true,tipType:'error',tipText:'文章还没有内容'});
			this.hideTip();
			return;
		}
		let data = {
			type:selectValue,
			title:title,
			tag:tagString,
			content:editor,
			articleId:articleID,
			todo:1//发布文章
		}
		this.sendRequest('post',data,(json) => {
			let order = json.article.order;
			this.setState({showTip:true,tipType:'success',tipText:'发布成功'});
			this.hideTip();
			this.props.history.push('/articles/'+order);
		});
	}

	saveAsDraft = (isAuto) => {
		let {editor,title,tagString,selectValue} = this.state;
		let data = {
			type:selectValue,
			title:title,
			tag:tagString,
			content:editor,
			articleId:articleID,
			todo:0//保存草稿
		}
		console.log(articleID)
		this.sendRequest('post',data,(json) => {
			let articleId = json.article._id;
			console.log(json.article)
			if(!articleID)
				articleID = articleId;
			if(!isAuto){
				this.setState({showTip:true,tipType:'success',tipText:'保存成功'});
				this.hideTip();
			}

		})
	}

	//发送请求mode: post--新建/保存草稿/发布文章 delete--舍弃草稿
	sendRequest = (mode,data,callback) => {
		clearTimeout(timer);
		fetch(url,{
			method:mode,
	        headers: {
		        'Accept': 'application/json',
				'Content-Type': 'application/json'
	      	},
		    mode:'cors',
		    credentials: 'include',
		    body: data ? JSON.stringify(data) : null
		}).then((response) => {
			return response.json();
		}).then((json) => {
			callback && callback(json);
		}).catch((err) => {
			console.log(err);
		});
	}

	comfirmQuit = () => {
		this.setState({showModal:false});
		let data = {
			articleId:articleID
		}
		this.sendRequest('delete',data,(json) => {
			this.setState({showTip:true,tipType:'success',tipText:'舍弃成功'});
			this.hideTip();
			articleID = null;
		});
	}

	handleModalClose = () => {
		this.setState({showModal:false});
	}

	hideTip = () => {
		setTimeout(() => this.setState({showTip:false}), 1000);
	}



	render(){
		let {title,editor,previewer,tagString,selectIsDown,selectText,selectValue,showTip,tipType,tipText,showModal,isPublic} = this.state;
		let list = tagString.split(';');
		list.splice(list.length - 1,1);
		let tagProps = {list:list,isLink:false,hasClose:true,handleTagDelete:this.handleTagDelete};
		let selectProps = {
			isDown:selectIsDown,
			showText:selectText,
			showValue:selectValue,
			list:[{name:'原创',value:0},{name:'转载',value:1},{name:'翻译',value:2}],
			handleSelect:this.handleSelect
		}
		let tipProps = {
			arrow:'no',
			type:tipType,
			text:tipText,
			classNames:'tip-bar-alert'
		}
		let modalProps = {
			isOpen:showModal,
			title:'舍弃草稿提醒',
			modalHtml:<p className="tips-in-modal">确定舍弃已保存的草稿吗？</p>,
			btns:[{name:'确定',ref:'ok',handleClick:this.comfirmQuit},{name:'取消',ref:'close'}],
			handleModalClose:this.handleModalClose
		}
		return(
			<div styleName="root">
				<div className="clearfix">
					<Select {...selectProps}/>
					<div className="input-wrap-normal" styleName="input-wrap">
						<input ref="title" className="input-normal no-border" type="text" value={title} placeholder="输入文章标题" data-role="title" onChange={this.handleTitleChange}/>
					</div>
					<div className="input-wrap-normal" styleName="input-wrap" data-role="tag-bar-wrap">
						<Tag  {...tagProps}/>
						<input className="input-normal no-border" type="text" placeholder="输入标签,以;分割" onChange={this.handleTagChange}/>
					</div>
					{
						isPublic  ? <div styleName="btn-group"><button className="btn-normal" onClick={this.handleSave}>保存</button></div> : 
									<div styleName="btn-group">
										<button className="btn-normal" onClick={this.handleSaveAsDraft}>保存草稿</button>
										<button className="btn-normal" onClick={this.handleQuitDraft}>舍弃草稿</button>
										<button className="btn-normal" onClick={this.handlePublic}>发布文章</button>
									</div>
					}
					
				</div>
				<div styleName="editor">
					<header styleName="header">编辑区</header>
					<textarea onChange={this.handleEditorChange} value={editor} placeholder="请在此开始你的文章">
					</textarea>
				</div>
				<div styleName="previewer">
					<header styleName="header">预览区</header>
					<div dangerouslySetInnerHTML={this.state.previewer}></div>
				</div>
				{showTip ? <TipBar {...tipProps} /> : null}
				{showModal ? <Modal {...modalProps} /> : null}
			</div>
		)
	}
}

export default CSSModules(Write, style,{handleNotFoundStyleName:'log'});