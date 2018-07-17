import marked from 'marked';
import moment from 'moment';
import Highlight from 'highlight.js';
import blogGlobal from './global';

//markdown解析
let rendererMD = new marked.Renderer();
rendererMD.heading = function (text, level) {
	let className = Number(level) <= 3 ? 'heading' : '';
	return '<h' + level + ' id=' + text + ' class=' + className + '>' + text + '</h' + level + '>';
}
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

//发送请求
function sendRequest(url, mode, data, callback){
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
        //console.log(err);
    });
}

function setPageAttr(){
    this.currentPage = 0;
    this.pageTotal = 0;
    this.pageSize = blogGlobal.pageSize;
    this.lastTime = "";
}

function getCurrentPage(currentPage){
    this.currentPage = currentPage;
}

function hideTip(callback){
    setTimeout(() => {
        this.setState({ showTip: false });
        Object.prototype.toString.call(callback) == "[object Function]" && callback();
    }, 1000);
}

function handleDelete(articleId){
    this.articleId = articleId;
    this.setState({ delModalShow: true });
}

function comfirmDel() {
    this.setState({ delModalShow: false });
    let url = blogGlobal.requestBaseUrl + "/articles";
    let data = {
        articleId: this.articleId
    }
    sendRequest(url, 'delete', data, (json) => {
        let {articleTotal} = json;
        let pageTotal = Math.ceil(articleTotal/this.pageSize);
        this.setState({ showTip: true });
        //判断文章是否全删完了
        if(articleTotal <= 0){
            this.setState({status:2});
            hideTip.call(this);
            return;
        }else if(pageTotal <= this.currentPage){//判断本页文章是否全删完了，如果是则到上一页
            this.currentPage--;
        }
        this.fetchList(this.lastTime,this.currentPage,this.pageSize,1);
        hideTip.call(this);
    });
}

function handleDelModalClose() {
    this.setState({ delModalShow: false })
}


function getDateDiff(date) {
    let timestamp = moment(date).format('x');
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let halfamonth = day * 15;
    let month = day * 30;
    let year = month * 12;
    let now = new Date().getTime();
    let diffValue = now - timestamp;
    if (diffValue < 0) {
        return '未知';
    }
    let yearC = diffValue / year;
    let monthC = diffValue / month;
    let weekC = diffValue / (7 * day);
    let dayC = diffValue / day;
    let hourC = diffValue / hour;
    let minC = diffValue / minute;
    let result = '';
    if(yearC >= 1){
        result = "" + parseInt(yearC) + "年前";
    }
    else if (monthC >= 1) {
        result = "" + parseInt(monthC) + "月前";
    }
    else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
    }
    else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
    }
    else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
    }
    else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
    } else
        result = "刚刚";
    return result;
}

function handlePasswordChange(event){
    let value = event.target.value;
    this.setState({password:value});
    if(value === ''){
        this.setState({
            passwordTip:blogGlobal.passwordRuleTip,
            passwordStatus:0,
            comfirmPasswordTip:'',
            comfirmPasswordStatus:0
        });
        return;
    }else if(value.length < 8){
        this.setState({
            passwordTip:blogGlobal.passwordRuleErrLength,
            passwordStatus:1,
            comfirmPasswordTip:'',
            comfirmPasswordStatus:0
        });
        return;
    }else if(value.match(/[^a-zA_Z0-9_~!@#$%\^&\*]/) || value.match(/^[0-9]+$/) || value.match(/^[a-zA-Z]+$/) || value.match(/^[_~!@#$%\^&\*]+$/)){
        this.setState({
            passwordTip:blogGlobal.passwordRuleErrType,
            passwordStatus:1,
            comfirmPasswordTip:'',
            comfirmPasswordStatus:0
        });
        return;
    }
    this.setState({
        passwordTip:blogGlobal.rulePassTip,
        passwordStatus:2
    });
}
function handlePasswordFocus(event){
    if(this.state.password.trim() === ''){
        this.setState({
            passwordTip:blogGlobal.passwordRuleTip,
            passwordStatus:0
        });
    }
}
function handlePasswordBlur(event){
    if(this.state.password.trim() === ''){
        this.setState({
            passwordTip:blogGlobal.passwordNullTip,
            passwordStatus:1
        });
    }
}
function handleComfirmPasswordChange(event){
    this.setState({comfirmPassword:event.target.value});
}
function handleComfirmPasswordFocus(event){
    this.setState({comfirmPasswordStatus:0});
}
function handleComfirmPasswordBlur(event){
    let comfirmPassword = this.state.comfirmPassword;
    if(comfirmPassword.trim() === '' && this.state.passwordStatus === 2){
        this.setState({
            comfirmPasswordTip:blogGlobal.comfirmPasswordNullTip,
            comfirmPasswordStatus:1
        });
        return;
    }else if(comfirmPassword !== this.state.password && this.state.passwordStatus === 2){
        this.setState({
            comfirmPasswordTip:blogGlobal.comfirmPasswordErr,
            comfirmPasswordStatus:1
        });
        return;
    }
    this.setState({
        comfirmPasswordTip:'',
        comfirmPasswordStatus:2
    });
}


export {
    marked,
    sendRequest,
    setPageAttr,
    getCurrentPage,
    hideTip,
    handleDelete,
    comfirmDel,
    handleDelModalClose,
    getDateDiff,
    handlePasswordChange,
    handlePasswordFocus,
    handlePasswordBlur,
    handleComfirmPasswordChange,
    handleComfirmPasswordFocus,
    handleComfirmPasswordBlur
}