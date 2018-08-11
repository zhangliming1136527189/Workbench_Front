import React, { Component } from 'react';
import { Button } from 'antd';
import ComLayout from './ComLayout';
class ApproveLanguage extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<ComLayout
				className="approvelanguage"
				title={this.props.title}
				headerOther={<Button type="primary">新增</Button>}
			>
				<div>222</div>
			</ComLayout>
		);
	}
}
export default ApproveLanguage;
