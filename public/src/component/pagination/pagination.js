import React from 'react';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import style from './pagination.scss'

class Pagination extends React.Component{
    constructor(props) {
		super(props);
	    this.state = {
            current:0,
            pageSize:20,
            total:1
	    };
    }
    handleFirst(e){
        if(this.state.current === 0){
            return;
        }
    }
    handlePrev(e){
        if(this.state.current === 0){
            return;
        }
    }
    handleNext(e){
        if(this.state.current === this.state.total - 1){
            return;
        }
    }
    handleNext(e){
        if(this.state.current === this.state.total - 1){
            return;
        }
    }
    render(){
        let {current,total} = this.state;
        return (
            total ? 
            <div data-role="pagination">
                 <button className={"btn-normal btn-sm"+(current !== 0 ? '':' disabled')} onClick={this.handleFirst}>首页</button>
                 <button className={"btn-normal btn-sm"+(current !== 0 ? '':' disabled')} onClick={this.handlePrev}>上一页</button>
                 <span styleName="pagination-info">{current+1}/{total}</span>
                 <button className={"btn-normal btn-sm"+(current !== total - 1 ? '':' disabled')} onClick={this.handleNext}>下一页</button>
                 <button className={"btn-normal btn-sm"+(current !== total - 1 ? '':' disabled')} onClick={this.handleLast}>末页</button>
            </div> : null
        )
    }
}

export default CSSModules(Pagination, style,{handleNotFoundStyleName:'log'});