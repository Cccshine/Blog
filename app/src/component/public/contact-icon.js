import React from 'react';

export default class ContactIcon extends React.Component{
	render(){
		return (
			<ul id="contact">
				<li className="contact-item"><a href="" title="Github" className="fa fa-github"></a></li>
				<li className="contact-item"><a href="" title="Segmentfault" className="fa fa-segmentfault"></a></li>
				<li className="contact-item"><a href="" title="LinkedIn" className="fa fa-linkedin"></a></li>
				<li className="contact-item"><a href="" title="Weibo" className="fa fa-weibo"></a></li>
				<li className="contact-item"><a href="" title="Douban" className="fa fa-douban"></a></li>
			</ul>
		)
	}
}