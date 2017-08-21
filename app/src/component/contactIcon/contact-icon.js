import React from 'react';
import CSSModules from 'react-css-modules';
import style from './contact-icon.scss'

class ContactIcon extends React.Component{
	render(){
		return (
			<ul styleName="contact">
				<li styleName="contact-item"><a href="" title="Github" className="fa fa-github"></a></li>
				<li styleName="contact-item"><a href="" title="Segmentfault" className="fa fa-segmentfault"></a></li>
				<li styleName="contact-item"><a href="" title="LinkedIn" className="fa fa-linkedin"></a></li>
				<li styleName="contact-item"><a href="" title="Weibo" className="fa fa-weibo"></a></li>
				<li styleName="contact-item"><a href="" title="Douban" className="fa fa-douban"></a></li>
			</ul>
		)
	}
}

export default CSSModules(ContactIcon,style,{handleNotFoundStyleName:'log'});