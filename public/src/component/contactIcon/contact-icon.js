import React from 'react';
import CSSModules from 'react-css-modules';
import style from './contact-icon.scss'

const ContactIcon = (props) => {
		return (
			<ul styleName="contact">
				<li styleName="contact-item"><a href="" title="Github" styleName="fa" className="fa fa-github"></a></li>
				<li styleName="contact-item"><a href="" title="Segmentfault" styleName="fa" className="fa fa-segmentfault"></a></li>
				<li styleName="contact-item"><a href="" title="LinkedIn" styleName="fa" className="fa fa-linkedin"></a></li>
				<li styleName="contact-item"><a href="" title="Weibo" styleName="fa" className="fa fa-weibo"></a></li>
				<li styleName="contact-item"><a href="" title="Douban" styleName="fa" className="fa fa-douban"></a></li>
			</ul>
		)
}

export default CSSModules(ContactIcon,style,{handleNotFoundStyleName:'log'});