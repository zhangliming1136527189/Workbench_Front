import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import './index.less';
import withDragDropContext from 'Pub/js/withDragDropContext';
//自定义组件
import MySider from './sider';
import MyContent from './content';
import {GetQuery} from 'Pub/js/utils';
import { connect } from 'react-redux';
import * as utilService from './utilService';
import { updateGroupList,clearData } from 'Store/test/action';
import Notice from 'Components/Notice';
import CustomDragLayer from './customDragLayer';

class Test extends Component {
	constructor(props) {
		super(props);
		const urlRequestObj = GetQuery(this.props.location.search);
		const relateidObj = utilService.getRelateidObj(urlRequestObj.pk_responsibility, urlRequestObj.is_group)
		this.state = {
			relateidObj:relateidObj
		};
		
	}

	componentWillUnmount() {
		this.props.clearData();
	}

	componentDidMount() {
		let ajaxData = {
			isuser: this.state.relateidObj.code //0职责 1用户 2集团
		};
		if(this.state.relateidObj.code === '0'){
			ajaxData.relateid = this.state.relateidObj.data;
		}
		Ajax({
			url: `/nccloud/platform/appregister/queryworkbench.do`,
			info: {
				name:'工作桌面配置',
				action:'工作桌面查询'
			},
			data: ajaxData,
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success && data&& data.length > 0 ) {
							_.forEach(data[0].groups, (g) => {
								g.type = "group";
								_.forEach(g.apps,(a)=>{
									a.isShadow = false;
									a.isChecked = false;
									a.apptype = Number(a.apptype);
									a.gridx = Number(a.gridx);
									a.gridy = Number(a.gridy);
									a.height = Number(a.height);
									a.width = Number(a.width);
								})
							});
							this.props.updateGroupList(data[0].groups);
						}else{
							if(success && data && data.length === 0){
								Notice({ status: 'warning', msg: '工作桌面为空，请配置' });
							}else{
								Notice({ status: 'error', msg: data });
							}
						}
				}
			}
		});
	}

	render() {
		//header 80px, footer 48px, anchor 48px;
		return (
			<div className="nc-desktop-setting">
					<MySider relateidObj={this.state.relateidObj}/>
					
					<MyContent relateidObj={this.state.relateidObj}/>
					
				<CustomDragLayer/>
			</div>
		);
	}
}

// const draDrop = DragDropContext(HTML5Backend)(Test);

export default connect(
	(state) => ({
	}),
	{
		updateGroupList,
		clearData
	}
)(withDragDropContext(Test));