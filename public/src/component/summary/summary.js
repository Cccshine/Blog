import React from 'react';
import {Link} from 'react-router-dom';
import CSSModules from 'react-css-modules';
import style from './tag.scss'

class Tag extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			tagList:props.list
		}
	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({tagList:nextProps.list});
	}

	handleClose = (event) => {
		let index = event.target.parentNode.dataset.index;
		let tagList = this.state.tagList;
		tagList.splice(index,1);
		this.setState({tagList:tagList});
	}

	render(){
		let {isLink,hasClose,handleTagDelete} = this.props;
		let {tagList} = this.state;
		return (
			<div styleName="tag-bar" data-role="tag-bar">
				{
					tagList.map((item,index) => (
						<div styleName="tag" key={index} data-index={index}>
							{isLink ? <Link to={"" + item}>{item}</Link> : <span>{item}</span>} 
							{hasClose ? <i className="fa fa-close" onClick={handleTagDelete ? handleTagDelete : this.handleClose}></i> : null}
						</div>
					))
				}
			</div>
		)
	}
}

export default CSSModules(Tag, style,{handleNotFoundStyleName:'log'});
