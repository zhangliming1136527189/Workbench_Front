import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { connect } from 'react-redux';
const { Header } = Layout;
import { Steps } from 'antd';
const Step = Steps.Step;

/**
 * 工作桌面 完成步骤 
 */
class MyHead extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siderHeight: '280',
			state:'browse'
		};
	}
	render() {
		return ( 
		<Header>
				<div className='template-setting-steps'>
					<Steps size='small' current={0}>
						<Step title='设置页面基本信息' description='进行中' />
						<Step title='配置模板区域' description='' />
						<Step title='配置完成' description='' />
					</Steps>
				</div>
	   </Header>
			   );
	     }
}
export default connect(
	(state) => ({
		zoneState: state.AppRegisterData.zoneState,
		getFromData: state.AppRegisterData.getFromData,
	}),
	{
	}
)(MyHead);
