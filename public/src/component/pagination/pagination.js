import React from 'react';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import style from './pagination.scss'

class Pagination extends React.Component{
    constructor(props) {
		super(props);
	    this.state = {
            currentPage:props.currentPage,
            pageSize:props.pageSize,
            pageTotal:props.pageTotal,
            lastTime:props.lastTime
	    };
    }
    componentWillReceiveProps = (nextProps) => {
        this.setState({currentPage:nextProps.currentPage,pageTotal:nextProps.pageTotal,lastTime:nextProps.lastTime});
    }
    handleFirst = (e) => {
        if(this.state.currentPage === 0){
            return;
        }
        this.setState({currentPage:0}, () => {
            this.props.fetchList(this.state.lastTime, this.state.currentPage,this.state.pageSize, -1);
            this.props.getCurrentPage(this.state.currentPage);
        });
    }
    handlePrev = (e) => {
        if(this.state.currentPage === 0){
            return;
        }
        this.setState({currentPage:(this.state.currentPage - 1)},() => {
            this.props.fetchList(this.state.lastTime, this.state.currentPage,this.state.pageSize, -1);
            this.props.getCurrentPage(this.state.currentPage);
        });
    }
    handleNext = (e) => {
        if(this.state.currentPage === this.state.pageTotal - 1){
            return;
        }
        this.setState({ currentPage: (this.state.currentPage + 1) },() => {
            this.props.fetchList(this.state.lastTime, this.state.currentPage,this.state.pageSize, 1);
            this.props.getCurrentPage(this.state.currentPage);
        });
    }
    handleLast = (e) => {
        if(this.state.currentPage === this.state.pageTotal - 1){
            return;
        }
        this.setState({currentPage:this.state.pageTotal - 1}, () => {
            this.props.fetchList(this.state.lastTime, this.state.currentPage,this.state.pageSize, 1);
            this.props.getCurrentPage(this.state.currentPage);
        });
    }
    render(){
        let {currentPage,pageTotal} = this.state;
        return (
            pageTotal ? 
            <div data-role="pagination">
                 <button className={"btn-normal btn-sm"+(currentPage !== 0 ? '':' disabled')} onClick={this.handleFirst}>首页</button>
                 <button className={"btn-normal btn-sm"+(currentPage !== 0 ? '':' disabled')} onClick={this.handlePrev}>上一页</button>
                 <span styleName="pagination-info">{currentPage+1}/{pageTotal}</span>
                 <button className={"btn-normal btn-sm"+(currentPage !== pageTotal - 1 ? '':' disabled')} onClick={this.handleNext}>下一页</button>
                 <button className={"btn-normal btn-sm"+(currentPage !== pageTotal - 1 ? '':' disabled')} onClick={this.handleLast}>末页</button>
            </div> : null
        )
    }
}

export default CSSModules(Pagination, style,{handleNotFoundStyleName:'log'});