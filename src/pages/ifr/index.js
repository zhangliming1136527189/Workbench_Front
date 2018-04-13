import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initIfrData, clearData } from 'Store/ifr/action';
import { GetQuery } from 'Pub/js/utils';
/**
 * 工作桌面各个应用挂载页面 统一通过 iframe 方式进行加载 
 */
class Ifr extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		console.log(this.props.location);
		let { ifrID, ifrName } = this.props.ifrData;
		let { ifr } = GetQuery(this.props.location.search);
		let queryUrl = decodeURIComponent(ifr);

		return (
			<div className='nc-workbench-iframe'>
				<iframe id='mainiframe' src={queryUrl} frameborder='0' scrolling='yes' />
			</div>
		);
	}
}
Ifr.propTypes = {
	ifrData: PropTypes.object.isRequired,
	initIfrData: PropTypes.func.isRequired,
	clearData: PropTypes.func.isRequired
};
export default connect(
	(state) => {
		return {
			ifrData: state.ifrData
		};
	},
	{
		initIfrData,
		clearData
	}
)(Ifr);
