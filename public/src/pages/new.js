import React from 'react';
import marked from 'marked';
import Tag from '../component/tag/tag';
import Select from '../component/select/select';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/new.scss'

class New extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			editor:'',
			previewer:{__html:''}
		}
	}

	handleEditorChange = (event) => {
		this.setState({editor:event.target.value,previewer:{__html:marked(event.target.value)}});
	}

	render(){
		return(
			<div styleName="new-file">
				<div styleName="detail-info-bar" className="clearfix">
					<Select list={['原创','转载','翻译']} />
					<div styleName="tag-bar-wrap">
						<div styleName="tag-bar">
							<Tag content="javascript" hasClose={true} />
							<Tag content="css3" hasClose={true} />
						</div>
						<input type="text" />
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
				<div styleName="btn-group">
					<button>保存为草稿</button>
					<button>发布文章</button>
				</div>
			</div>
		)
	}
}

export default CSSModules(New, style,{handleNotFoundStyleName:'log'});