import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Modal from '../component/modal/modal';
import TipBar from '../component/tipBar/tip-bar';
import Pagination from '../component/pagination/pagination';
import TagComponent from '../component/tag/tag';
import CSSModules from 'react-css-modules';
import style from '../sass/pages/tag.scss';
import blogGlobal from '../util/global';
import { marked, sendRequest, setPageAttr, getCurrentPage, handleDelete, comfirmDel, handleDelModalClose } from '../util/util';

const RADIUS = 200,FALLLENGTH = 400;
let tagBallAttr = {}, tags = [], animateFrame = null, angleX = Math.PI/1000,angleY = Math.PI/1000;//angleX与angleY分别表示x,y轴转动的弧度
let target = null;

class Tag extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			articleList: [],
			tagList: [],
			status: 0,//0--正在获取 1--获取成功 2--暂无内容
			delModalShow: false,
			showTip: false,
		}
		this.articleId = null;
		this.isTagList = false;
		this.mounted = true;
		setPageAttr.call(this);
	}

	componentWillMount = () => {
		let tagName = this.props.match.params.tagName || null;
		if (tagName) {
			this.fetchList((new Date()).toISOString(),0,this.pageSize,1);
		} else {
			this.isTagList = true;
			let url = blogGlobal.requestBaseUrl + "/tags";
			sendRequest(url, 'get', null, (json) => {
				if(!this.mounted){
					return;
				}
				//console.log(json);
				let { status, tagList } = json;
				if (status == 0) {
					this.setState({ status: 2 });
				} else if (status == 1) {
					this.setState({ status: 1, tagList: tagList });
					let tagBall = this.refs.tagBall;
					tagBallAttr = {
						halfW : tagBall.offsetWidth / 2,//tagBall的二分之一宽度
						halfH : tagBall.offsetHeight / 2,//tagBall的二分之一高度
						left: this.getOffset(tagBall).left + document.body.scrollLeft + document.documentElement.scrollLeft,//tagBall距离页面左侧的距离
						top: this.getOffset(tagBall).top + document.body.scrollTop + document.documentElement.scrollTop//tagBall距离页面顶部的距离
					}
					this.tagCloudInit();
				}
			})
		}
	}

	componentWillUnmount = () => {
		this.mounted = false;
		tagBallAttr = {};
		tags = [];
		angleX = Math.PI/1000;
		angleY = Math.PI/1000;
	}

	fetchList = (lastTime,currentPage,pageSize,dir) => {
		let tagName = this.props.match.params.tagName || null;
		let url = blogGlobal.requestBaseUrl + "/articles?mode=public&tagName="+tagName+"&lastTime="+lastTime+"&currentPage="+currentPage+"&pageSize="+pageSize+"&dir="+dir;
		sendRequest(url, 'get', null, (json) => {
			if(!this.mounted){
				return;
			}
			//console.log(json);
			let { status, articleList ,pageTotal } = json;
			if (status == 0) {
				this.setState({ status: 2 });
			} else if (status == 1) {
				this.pageTotal = pageTotal;
				this.lastTime = articleList[articleList.length - 1].publicTime;
				this.setState({ status: 1, articleList: articleList});
			}
		})
	}

	//-------------------------标签云-------------------------
	

	tagCloudInit = () => {
		let tagEles = document.querySelectorAll(".tag");
		let length = tagEles.length;
		for (let i = 0; i < length; i++){
			//对θ和Φ取随机数，来获得圆上的随机点坐标(获得球面上所需要的平均分布的点)
			let k = (2 * (i + 1) - 1)/length - 1;
			let theta = Math.acos(k);
			let fa = theta * Math.sqrt(Math.PI * length);
			let x = RADIUS * Math.sin(theta) * Math.cos(fa);
			let y = RADIUS * Math.sin(theta) * Math.sin(fa);
			let z = RADIUS * Math.cos(theta);

			let tag = new CloudTag(tagEles[i],x,y,z);
			tagEles[i].style.color = "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")";
			tags.push(tag);
			tag.move();
		}
		this.animate();
	}

	rotateX = () => {
		let cos = Math.cos(angleX);
		let sin = Math.sin(angleX);
		for (let tag of tags){
			//矩阵旋转公式(绕x轴旋转)
			let y1 = tag.y * cos - tag.z * sin;
			let z1 = tag.z * cos + tag.y * sin;
			tag.y = y1;
			tag.z = z1;
		}
	}

	rotateY = () => {
		let cos = Math.cos(angleY);
		let sin = Math.sin(angleY);
		for (let tag of tags){
			//矩阵旋转公式(绕y轴旋转)
			let x1 = tag.x * cos - tag.z * sin;
			let z1 = tag.z * cos + tag.x * sin;
			tag.x = x1;
			tag.z = z1;
		}
	}

	animate = () => {
		this.rotateX();
		this.rotateY();
		for (let tag of tags){
			tag.move();
		}
		animateFrame = requestAnimationFrame(this.animate);
	}

	handleMouseMove = (event) => {
		let x = event.clientX - tagBallAttr.left - tagBallAttr.halfW;
		let y = event.clientY - tagBallAttr.top - tagBallAttr.halfH;
		if(x > -200 && x < 200){
			angleY = -(x * 0.00001);
		}else{
			angleY = -(x * 0.00005);
		}
		if(y > -200 && y < 200){
			angleX = -(y * 0.00001);
		}else{
			angleX = -(y * 0.00005);
		}
	}

	//-------------------------标签云-------------------------

	getOffset = (obj) => {
		let top = 0,left = 0;
		while (obj) {
			top += obj.offsetTop;
			left += obj.offsetLeft;
			obj = obj.offsetParent;
		}
		return {"top":top,"left":left};
	}

	render() {
		let {isTagList,currentPage,pageSize,pageTotal,lastTime} = this;
		let {role} = this.props;
		let { status, articleList, tagList, delModalShow, showTip} = this.state;
		let delModalProps = {
			isOpen: delModalShow,
			title: '删除提醒',
			modalHtml: <p className="tips-in-modal">确定删除该文章吗？</p>,
			btns: [{ name: '确定', ref: 'ok', handleClick: comfirmDel.bind(this) }, { name: '取消', ref: 'close' }],
			handleModalClose: handleDelModalClose.bind(this)
		}
		let tagProps = { isLink: true, hasClose: false };
		let tipProps = {
			arrow: 'no',
			type: 'success',
			text: '删除成功',
			classNames: 'tip-bar-alert'
		}
		let pageProps ={
			currentPage:currentPage,
			pageSize: pageSize,
			pageTotal: pageTotal,
			lastTime: lastTime,
			fetchList: this.fetchList,
			getCurrentPage: getCurrentPage.bind(this)
		}
		let rootPadding = isTagList ? {padding:20} : {padding:'20px 20px 20px 100px'};
		return (
			<div styleName="root" style={rootPadding}>
				{
					(() => {
						switch (status) {
							case 1:
								return (
									isTagList ? 
									<div styleName="tag-ball" ref="tagBall" onMouseMove={this.handleMouseMove}>
										{
											tagList.map((item, index) => {
												return <Link key={index} target="_blank" to={"/tags/" + item.name} className="tag" styleName="tag">{item.name}</Link>
											})
										}
									</div> :
									<div>
										<h2 styleName="tag-title"><span styleName="timeline-circle"></span><strong>{this.props.match.params.tagName}</strong>标签</h2>
										{
											articleList.map((item, index) => {
												let list = item.tag.split(';');
												list = list.slice(0, list.length - 1);
												return (
													<section styleName="summary-section" key={index}>
														<div className="clearfix">
															<h3 className="fl"><Link target="_blank" to={"/articles/" + item._id}>{item.title}</Link></h3>
															{
																role === 0 ? null : <div styleName="btn-group" className="fr">
																	<button className="btn-normal btn-sm"><Link target="_self" to={"/write/" + item._id}>编辑</Link></button>
																	<button className="btn-normal btn-sm" onClick={handleDelete.bind(this, item._id)}>删除</button>
																</div>
															}
														</div>
														<div styleName="tag-panel">
															{<TagComponent {...tagProps} list={list} />}
														</div>
														<div styleName="summary" className="markdown">
															<p dangerouslySetInnerHTML={{ __html: marked(item.summary) }}></p>
														</div>
														<div styleName="more">
															<Link target="_blank" to={"/articles/" + item._id}>查看更多</Link>
														</div>
														<span styleName="timeline-circle"></span>
														<span styleName="timeline-date">{moment(item.publicTime).format('YYYY-MM-DD')}</span>
													</section>
												)
											})
										}
										<Pagination {...pageProps}/>
									</div>
								)
								break;
							case 2:
								return <h3 styleName="null-tip">暂无内容</h3>
								break;
							default:
								return <div styleName="loading"><i className="fa fa-spinner fa-pulse"></i><span>正在加载...</span></div>
								break;
						}
					})()
				}
				{status == 1 && !isTagList ? <div styleName="timeline-bar"></div> : null}
				{delModalShow ? <Modal {...delModalProps} /> : null}
				{showTip ? <TipBar {...tipProps} /> : null}
			</div>
		)
	}
}

class CloudTag{
	constructor(ele, x, y, z) {
		this.ele = ele;
		this.x = x;
		this.y = y;
		this.z = z;
	}

	move(){
		let scale = FALLLENGTH / (FALLLENGTH - this.z);//比例，也靠近用户，比例越大 (2/3 ~ 2)
		let alpha = (this.z +  RADIUS)/ (2 * RADIUS);//透明度随z轴的变化量（0～1）
		let left = this.x + tagBallAttr.halfW - this.ele.offsetWidth / 2 + "px";//left定位值
		let top = this.y + tagBallAttr.halfH - this.ele.offsetHeight / 2 + "px";//top定位值
		let transform = "translate(" + left + ", " + top + ") scale(" + scale + ")";
		this.ele.style.opacity = (alpha > 0.5 ? 0.5 : alpha) + 0.5;
		this.ele.style.zIndex = parseInt(scale * 100);
		this.ele.style.transform = transform;
		this.ele.style.webkitTransform = transform;
	}
} 

export default CSSModules(Tag, style, { handleNotFoundStyleName: 'log' });