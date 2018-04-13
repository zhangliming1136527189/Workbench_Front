import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeIntlData, saveImg, clearData } from 'Store/home/action';
import Masonry from 'masonry-layout';
import { Link as TabLink, Element } from 'react-scroll';
// 工作桌面单页通用布局
import TabsLink from 'Components/TabsLink';
import './index.less';

const UNIT = 175;
/**
 * 工作桌面 首页 页面
 * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染
 */
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			paths: []
		};
	}
	componentDidMount() {
		let { paths } = this.state;
		axios({
			method: 'POST',
			url: `/nccloud/platform/appregister/query.do`
		}).then((res) => {
			if (res) {
				let { data, success } = res.data;
				if (success && data && data.length > 0) {
					this.setState({ paths: data }, this.createScript);
					let grid = document.querySelectorAll('.grid');
					for (let index = 0; index < grid.length; index++) {
						const element = grid[index];
						new Masonry(element, {
							itemSelector: '.grid-item',
							columnWidth: 177,
							gutter: 10
						});
					}
				}
			}
		});
	}

	createScript = () => {
		let { paths } = this.state;
		let scripts = document.getElementsByTagName('script');
		// 将 HTMLCollection 类数组对象转换成真正的数组
		let scriptsArray = Array.prototype.slice.call(scripts, 0);
		let bodyDOM = document.getElementsByTagName('body')[0];
		// 将所有的 script 标签 src 值数组
		scriptsArray = scriptsArray.map((scriptItem) => {
			// script 标签上真正书写的 src 字符串
			if (scriptItem.attributes.src) {
				return scriptItem.attributes.src.value;
			}
		});
		// paths 后台返回的当前用户首页所有小部件相关内容
		paths.map((item, index) => {
			let { path, apptype } = item;
			if (apptype === '2') {
				let scriptPath = path;
				// 查找后台提供的小部件 js 路径是否已经加载到 dom 中
				let flag = scriptsArray.find((scriptsSrc) => {
					return scriptsSrc === scriptPath;
				});
				// 如果没有，进行 script 标签创建及加载指定 js 文件
				if (typeof flag === 'undefined') {
					let script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = path;
					bodyDOM.appendChild(script);
				} else {
					for (let scriptIndex = 0; scriptIndex < scripts.length; scriptIndex++) {
						const element = scripts[scriptIndex];
						if (element.attributes.src && element.attributes.src.value === flag) {
							bodyDOM.removeChild(element);
							let script = document.createElement('script');
							script.type = 'text/javascript';
							script.src = flag;
							bodyDOM.appendChild(script);
						}
					}
				}
			}
		});
	};

	appTargetPage(appOption) {
		const { apptype, pk_appregister } = appOption;
		axios({
			method: 'POST',
			url: `nccloud/platform/appregister/openapp.do`,
			data: JSON.stringify({
				pk_appregister: pk_appregister
			})
		}).then((res) => {
			if (res) {
				let { data, success } = res.data;
				if (success) {
					window.openNew(data);
				}
			}
		});
	}

	/**
	 * 动态创建小应用
	 * @param {Object} appOption // 小部件类型 
	 * @param {Number} domWidth // 小应用宽度
	 * @param {Number} domHeight // 小应用高度
	 */
	createApp = (appOption, domWidth, domHeight) => {
		const { img_src, name, mountid, target_path } = appOption;
		return (
			<div
				className='grid-item'
				id={mountid}
				style={{ width: domWidth, height: domHeight }}
				onClick={() => {
					this.appTargetPage(appOption);
				}}
			>
				<div className='app-item'>
					<span className='title'>{name}</span>
					<div className='app-content'>
						<img className='icon' src={img_src} alt={name} />
					</div>
				</div>
			</div>
		);
	};

	/**
	 * 动态创建小部件挂载容器
	 * @param {Object} widgets // 小部件类型 
	 */
	createWidgetMountPoint = (widgets) => {
		return widgets.map((item, index) => {
			if (item) {
				let { apptype, width, height } = item;
				const domWidth = Number(width) * UNIT;
				const domHeight = Number(height) * UNIT;
				if (apptype === '1') {
					return this.createApp(item, domWidth, domHeight);
				} else if (apptype === '2') {
					return (
						<div className={`grid-item`} style={{ width: domWidth, height: domHeight }} id={item.mountid} />
					);
				}
			}
		});
	};

	render() {
		let { paths } = this.state;
		return (
			<div className='nc-workbench-home-page'>
				<TabsLink />
				<div className='nc-workbench-home-container'>
					<Element name='no1' className='n-col padding-left-70 padding-right-60'>
						<div className='title'>分组一</div>
						<div class='grid'>
							{paths.length > 0 ? (
								this.createWidgetMountPoint(
									paths.map((item) => {
										return item;
									})
								)
							) : (
								<div
									className='grid-item app-item widget-container'
									style={{ width: `${UNIT}px`, height: `${UNIT}px` }}
								>
									<div className='app-item'>
										<span className='icon'>loa</span>
										<span className='title'>loading</span>
									</div>
								</div>
							)}
							{/* {createItem()} */}
						</div>
					</Element>
					{/* <Element name='no2' className='n-col padding-left-70 padding-right-60'>
						<div className='title'>分组二</div>
						<div className='grid'>
							{this.createWidgetMountPoint(paths)}
							{createItem()}
						</div>
					</Element> */}
				</div>
			</div>
		);
	}
}

const createItem = () => {
	let itemDoms = [];
	for (let index = 0; index < 30; index++) {
		itemDoms.push(
			<div style={{ width: `${UNIT}px`, height: `${UNIT}px` }} className={`grid-item widget-container `}>
				<div className='app-item'>
					<span className='icon'>{index}</span>
					<span className='title'>应用{index}</span>
				</div>
			</div>
		);
	}
	return itemDoms;
};
const scrollToAnchor = (anchorName) => {
	if (anchorName) {
		let anchorElement = document.getElementById(anchorName);
		if (anchorElement) {
			// anchorElement.scrollIntoView(true);
			anchorElement.scrollIntoView({
				behavior: 'smooth'
			});
		}
	}
};

Home.PropTypes = {
	formData: PropTypes.object.isRequired,
	changeIntlData: PropTypes.func.isRequired,
	saveImg: PropTypes.func.isRequired,
	clearData: PropTypes.func.isRequired
};
export default connect(
	(state) => ({
		formData: state.formData,
		proData: state.proData
	}),
	{
		changeIntlData,
		saveImg,
		clearData
	}
)(Home);
