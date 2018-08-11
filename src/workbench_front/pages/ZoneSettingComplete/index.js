import React, { Component } from 'react';
import MyHeader from './header';
import MyContent from './content';
import './index.less';
import { Steps } from 'antd';
import {GetQuery} from 'Pub/js/utils';

const Step = Steps.Step;

class ZoneSetting extends Component {
	constructor(props) {
		super(props);
		const urlRequestObj = GetQuery(this.props.location.search);
		
		this.state = {
			templetid :urlRequestObj.templetid
		};
	}

	componentDidMount() {}

	render() {
		return (
			<div className='template-setting-complete-page'>
				<div className='template-setting-steps'>
					<Steps size='small' current={2}>
						<Step title='设置页面基本信息' description='完成' />
						<Step title='配置模板区域' description='进行中' />
						<Step title='配置完成' description='' />
					</Steps>
				</div>
				<MyHeader />
				<div className='template-setting-container'>
					<MyContent templetid={this.state.templetid} />
				</div>
			</div>
		);
	}
}
export default ZoneSetting;
