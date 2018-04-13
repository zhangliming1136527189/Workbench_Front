import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initAppData } from 'Store/appStore/action';
import store from './store';
import Routes from './routes';
import 'Pub/css/public.less';
import './theme/theme.css';

class App extends Component {
	static propTypes = {
		initAppData: PropTypes.func.isRequired
	};
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		/**
	 * 在新页签中打开
	 * @param　{String} url // 目标页面路径
	 * @param　{String} type // new - 浏览器新页签打开 不传参数在当前页打开
	 */
		window.openNew = (url, type) => {
			if (type === 'new') {
				let win = window.open(`/#/ifr?ifr=${encodeURIComponent(url)}`, '_blank');
				win.focus();
			} else {
				window.location.hash = `#/ifr?ifr=${encodeURIComponent(url)}`;
			}
		};
	}
	componentDidMount() {
		// 模拟数据，应该在此处进行数据请求，返回用户初始信息
		let data = {
			lang: 'zh-CN',
			userInfo: '小明'
		};
		this.props.initAppData(data);
	}
	render() {
		return <Routes />;
	}
}
const AppStore = connect((state) => ({ ifrData: state.ifrData }), {
	initAppData
})(App);
ReactDOM.render(
	<Provider store={store}>
		<AppStore />
	</Provider>,
	document.querySelector('#ncc')
);
