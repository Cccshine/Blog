import React from 'react';
import CSSModules from 'react-css-modules';
import style from './contact-icon.scss'

const ContactIcon = (props) => {
		return (
			<ul styleName="contact">
				<li styleName="contact-item"><a href="https://github.com/Cccshine" title="Github" styleName="fa" className="fa fa-github"></a></li>
				<li styleName="contact-item"><a href="https://segmentfault.com/u/cccshine" title="Segmentfault" styleName="fa" className="fa fa-segmentfault"></a></li>
				<li styleName="contact-item"><a href="https://cccshine.github.io/Resume/Resume/index.html" title="Resume" styleName="fa" className="fa fa-file-text-o"></a></li>
				<li styleName="contact-item"><a href="http://www.linkedin.com/in/%E5%98%89%E8%81%AA-%E6%9B%B9-344948126/" title="LinkedIn" styleName="fa" className="fa fa-linkedin"></a></li>
				{/*<li styleName="contact-item"><a href="" title="Weibo" styleName="fa" className="fa fa-weibo"></a></li>
				<li styleName="contact-item"><a href="" title="Douban" styleName="fa" className="fa fa-douban"></a></li>*/}
			</ul>
		)
}

export default CSSModules(ContactIcon,style,{handleNotFoundStyleName:'log'});