import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.less';
import MyHeader from './header';
import MyContent from './content';
import MyRightSider from './rightSider';
import { Steps } from 'antd';
import {GetQuery} from 'Pub/js/utils';
const Step = Steps.Step;
//模板配置首页
class ZoneSetting extends Component {
	constructor(props) {
		super(props);
		this.urlRequestObj = GetQuery(this.props.location.search);
		
		this.state = {
			templetid: this.urlRequestObj.templetid,
			status: this.urlRequestObj.status,  // status 
		};
	}

	componentDidMount() {}

	render() {
		let show = this.urlRequestObj.status ? 'display_none' :'template-setting-steps';
		return (
			<div className='template-setting-page'>
				<div className={show}>
					<Steps size='small' current={1}>
						<Step title='设置页面基本信息' description='完成' />
						<Step title='配置模板区域' description='进行中' />
						<Step title='配置完成' description='' />
					</Steps>
				</div>
				<MyHeader templetid={this.state.templetid} status={this.state.status}/>
				<div className='template-setting-container'>
					<MyContent templetid={this.state.templetid} status={this.state.status} />
					<MyRightSider />
				</div>
			</div>
		);
	}
}
export default connect((state) => ({}), {})(ZoneSetting);
