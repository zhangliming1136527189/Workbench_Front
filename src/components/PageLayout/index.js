import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.less';
/**
 * 工作桌面中页面布局组件
 * @param {Number} height 距离浏览器顶部的距离
 */
class PageLayout extends Component {
	render() {
		let { height = 40 } = this.props;
		return (
			<div
				className='page-scroll'
				style={{
					height: `calc(100vh - ${height}px)`
				}}
			>
				<div className='page-layout'>{this.props.children}</div>
			</div>
		);
	}
}

PageLayout.propTypes = {
	// breadcrumb: PropTypes.array,
	children: PropTypes.any.isRequired
};

export default PageLayout;
