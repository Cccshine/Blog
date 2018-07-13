import React from 'react';
import marked from 'marked';
import Highlight from 'highlight.js';
import Tag from '../component/tag/tag';
import Select from '../component/select/select';
import TipBar from '../component/tipBar/tip-bar';
import Modal from '../component/modal/modal';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/write.scss'
import blogGlobal from '../data/global';

const url = blogGlobal.requestBaseUrl + "/articles";
let timer = null;
let articleID = null;
let rendererMD = new marked.Renderer();
Highlight.initHighlightingOnLoad();
marked.setOptions({
	renderer: rendererMD,
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: false,
	smartLists: true,
	smartypants: false,
	highlight: function (code) {
		return Highlight.highlightAuto(code).value;
	}
});

class Write extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			editor: '',
			previewer: { __html: '' },
			tagString: '',
			selectIsDown: false,
			selectText: '原创',
			selectValue: 0,
			tipType: '',
			showTip: false,
			tipText: '',
			showModal: false,
			isPublic: false //是否已发表（true--已发表的文章再来编辑  false--新建的文章或者草稿来编辑）
		}
	}

	componentWillMount = () => {
		let articleId = this.props.match.params.articleId || null;
		if (!articleId)
			return;
		fetch(url + '?mode=edit&articleId=' + articleId, {
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
				isPublic: article.isPublic,
				editor: article.content,
				previewer: { __html: marked(article.content) },
				title: article.title,
				tagString: article.tag,
				selectValue: article.type
			});
		}).catch((err) => {
			console.log(err);
		});
	}

	componentWillUnmount = () => {
		articleID = null;
	}

	handleEditorChange = (event) => {
		let value = event.target.value;
		this.setState({ editor: value, previewer: { __html: marked(value) } });
		if (!timer) {
			timer = setTimeout(() => {
				this.saveAsDraft(true);
				timer = null;
			}, 5000)
		}
	}

	handleTabDown = (event) => {
		let target = event.target;
		let reg = /((.|\n){3}\s{2}|(.|\n)\s{2}(\*|-){1}\s{1}|(.|\n){2}\s{2}(\*|-){1}|\s{2}\d\.\s{1}|(.|\n)\s{2}\d\.)/;
		if (event.shiftKey && event.keyCode === 9) {
			event.preventDefault();
			let judge = target.value.substr(target.selectionStart - 5, 5);
			if (!reg.test(judge)) {
				return;
			}
			let position = target.selectionStart - 2;
			if(/(.|\n)\s{2}(\*|-){1}\s{1}/.test(judge)){
				target.value = target.value.substr(0, target.selectionStart - 4) + target.value.substr(target.selectionStart-2);
			}else if(/(.|\n){2}\s{2}(\*|-){1}/.test(judge)){
				target.value = target.value.substr(0, target.selectionStart - 3) + target.value.substr(target.selectionStart-1);
			}else if(/\s{2}\d\.\s{1}/.test(judge)){
				target.value = target.value.substr(0, target.selectionStart - 5) + target.value.substr(target.selectionStart-3);
			}else if(/(.|\n)\s{2}\d\./.test(judge)){
				target.value = target.value.substr(0, target.selectionStart - 4) + target.value.substr(target.selectionStart-2);
			}else{
				target.value = target.value.substr(0, target.selectionStart - 2) + target.value.substr(target.selectionStart);				
			}
			target.selectionStart = position;
			target.selectionEnd = position;
			target.focus();
		} else if (event.keyCode === 9) {
			event.preventDefault();
			let position = target.selectionStart + 2;//此处用了2个空格表示缩进，其实无所谓几个，只要和下面保持一致就好了。
			target.value = target.value.substr(0, target.selectionStart) + '  ' + target.value.substr(target.selectionStart);
			target.selectionStart = position;
			target.selectionEnd = position;
			target.focus();
		}
		//注释快捷键
		if((event.metaKey && event.keyCode === 191) || (event.ctrlKey && event.keyCode === 191)){
			event.preventDefault();
			let reg = /\n/g;
			let temp = reg.exec(target.value);
			let begin = temp;
			let end = temp;
			let beginIndex = 0;
			let endIndex = 0;
			while(temp && temp.index < target.selectionStart){
				begin = temp;
				temp = reg.exec(target.value);
				end = temp
			}
			if(!begin){
				beginIndex = -1;
				endIndex = target.value.length;
			}else{
				if(!end){
					beginIndex = begin.index;
					endIndex = target.value.length;
				}else{
					if(begin.index === end.index){
						beginIndex = -1;
					}else{
						beginIndex = begin.index;
					}
					endIndex = end.index;
				}
			}
			let activeLine = target.value.slice(beginIndex+1,endIndex);
			let position = target.selectionStart
			if(/<!-- .+ -->/.test(activeLine)){
				position = target.selectionStart;
				target.value = target.value.slice(0, beginIndex + 1) + target.value.slice(beginIndex + 6, endIndex - 4) + target.value.slice(endIndex);				
			}else{
				position = endIndex + 5;
				target.value = target.value.slice(0, beginIndex + 1) + '<!-- ' + target.value.slice(beginIndex + 1, endIndex) + ' -->'+target.value.slice(endIndex);
			}
			target.selectionStart = position;
			target.selectionEnd = position;
			target.focus();
		}
		this.setState({ editor: target.value, previewer: { __html: marked(target.value) } });
	}

	handleTitleChange = (event) => {
		this.setState({ title: event.target.value });
	}

	handleTagChange = (event) => {
		let value = event.target.value;
		//标签去重
		let reg = new RegExp('(^'+value+'|;'+value+')');
		if (value.indexOf(';') > 0) {
			if(!reg.test(this.state.tagString)){
				this.setState({ tagString: this.state.tagString + value });
			}
			event.target.value = '';
		}
	}

	handleTagBlur = (event) => {
		let value = event.target.value;
		if (value.indexOf(';') <= 0) {
			event.target.value = '';
		}
	}

	//传给子组件Tag的回调函数
	handleTagDelete = (event) => {
		let index = event.target.parentNode.dataset.index;
		let list = this.state.tagString.split(';');
		list.splice(index, 1);
		let newTagString = list.join(';');
		this.setState({ tagString: newTagString });
	}
	//传给子组件Select的回调函数
	handleSelect = (event) => {
		this.setState({ selectIsDown: false, selectText: event.target.innerText, selectValue: event.target.dataset.value });
	}


	handleSaveAsDraft = (event) => {
		this.saveAsDraft(false);
	}

	handleQuitDraft = (event) => {
		let { editor, title, tagString, selectValue } = this.state;
		if (!articleID) {
			this.setState({ showTip: true, tipType: 'error', tipText: '该文章暂未保存到草稿箱' });
			this.hideTip();
			return;
		}
		this.setState({ showModal: true });

	}

	handlePublic = (mode, event) => {
		let { editor, title, tagString, selectValue } = this.state;
		if (title.trim() === '') {
			this.setState({ showTip: true, tipType: 'error', tipText: '标题不能为空' });
			this.hideTip();
			return;
		} else if (editor.trim() == '') {
			this.setState({ showTip: true, tipType: 'error', tipText: '文章还没有内容' });
			this.hideTip();
			return;
		}
		let data = {
			type: selectValue,
			title: title,
			tag: tagString,
			content: editor,
			articleId: articleID,
			todo: 1//发布文章
		}
		this.sendRequest('post', data, (json) => {
			let articleId = json.article._id;
			let tipText = mode == 'save' ? '保存成功' : '发布成功';
			this.setState({ showTip: true, tipType: 'success', tipText: tipText });
			this.hideTip(() => {
				this.props.history.push('/articles/' + articleId);
			});
		});
	}

	saveAsDraft = (isAuto) => {
		let { editor, title, tagString, selectValue } = this.state;
		console.log('articlID'+articleID)
		let data = {
			type: selectValue,
			title: title,
			tag: tagString,
			content: editor,
			articleId: articleID,
			todo: 0//保存草稿
		}
		console.log(articleID)
		this.sendRequest('post', data, (json) => {
			let articleId = json.article._id;
			console.log(json.article)
			if (!articleID)
				articleID = articleId;
			if (!isAuto) {
				this.setState({ showTip: true, tipType: 'success', tipText: '保存成功' });
				this.hideTip();
			}

		})
	}

	//发送请求mode: post--新建/保存草稿/发布文章 delete--舍弃草稿
	sendRequest = (mode, data, callback) => {
		clearTimeout(timer);
		fetch(url, {
			method: mode,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: 'cors',
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
		this.setState({ showModal: false });
		let data = {
			articleId: articleID
		}
		this.sendRequest('delete', data, (json) => {
			this.setState({ showTip: true, tipType: 'success', tipText: '舍弃成功' });
			this.hideTip();
			articleID = null;
		});
	}

	handleModalClose = () => {
		this.setState({ showModal: false });
	}

	hideTip = (callback) => {
		setTimeout(() => {
			this.setState({ showTip: false });
			Object.prototype.toString.call(callback) == "[object Function]" && callback();
		}, 1000);
	}



	render() {
		let { title, editor, previewer, tagString, selectIsDown, selectText, selectValue, showTip, tipType, tipText, showModal, isPublic } = this.state;
		let list = tagString.split(';');
		list.splice(list.length - 1, 1);
		let tagProps = { list: list, isLink: false, hasClose: true, handleTagDelete: this.handleTagDelete };
		let selectProps = {
			isDown: selectIsDown,
			showText: selectText,
			showValue: selectValue,
			list: [{ name: '原创', value: 0 }, { name: '转载', value: 1 }, { name: '翻译', value: 2 }],
			handleSelect: this.handleSelect
		}
		let tipProps = {
			arrow: 'no',
			type: tipType,
			text: tipText,
			classNames: 'tip-bar-alert'
		}
		let modalProps = {
			isOpen: showModal,
			title: '舍弃草稿提醒',
			modalHtml: <p className="tips-in-modal">确定舍弃已保存的草稿吗？</p>,
			btns: [{ name: '确定', ref: 'ok', handleClick: this.comfirmQuit }, { name: '取消', ref: 'close' }],
			handleModalClose: this.handleModalClose
		}
		return (
			<div styleName="root">
				<div className="clearfix">
					<Select {...selectProps} />
					<div className="input-wrap-normal" styleName="input-wrap">
						<input ref="title" className="input-normal no-border" type="text" value={title} placeholder="输入文章标题" data-role="title" onChange={this.handleTitleChange} />
					</div>
					<div className="input-wrap-normal" styleName="input-wrap" data-role="tag-bar-wrap">
						<Tag  {...tagProps} />
						<input className="input-normal no-border" type="text" placeholder="输入标签,以;分割" onChange={this.handleTagChange} onBlur={this.handleTagBlur}/>
					</div>
					{
						isPublic ? <div styleName="btn-group"><button className="btn-normal" onClick={this.handlePublic.bind(this,'save')}>保存</button></div> :
							<div styleName="btn-group">
								<button className="btn-normal" onClick={this.handleSaveAsDraft}>保存草稿</button>
								<button className="btn-normal" onClick={this.handleQuitDraft}>舍弃草稿</button>
								<button className="btn-normal" onClick={this.handlePublic.bind(this,'public')}>发布文章</button>
							</div>
					}

				</div>
				<div styleName="editor">
					<header styleName="header">编辑区</header>
					<textarea onChange={this.handleEditorChange} onKeyDown={this.handleTabDown} value={editor} placeholder="请在此开始你的文章">
					</textarea>
				</div>
				<div styleName="previewer">
					<header styleName="header">预览区</header>
					<div className="markdown" dangerouslySetInnerHTML={this.state.previewer}></div>
				</div>
				{showTip ? <TipBar {...tipProps} /> : null}
				{showModal ? <Modal {...modalProps} /> : null}
			</div>
		)
	}
}

export default CSSModules(Write, style, { handleNotFoundStyleName: 'log' });