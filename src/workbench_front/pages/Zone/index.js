import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import {
	setZoneData,
	setZoneTempletid,
	setNewList,
	clearData
} from 'Store/Zone/action';
import Ajax from 'Pub/js/ajax';
import ModuleFromCard from './ModuleFromCard';
import { PageLayout } from 'Components/PageLayout';
import Notice from 'Components/Notice';
import ZoneTable from './ZoneTable';
import MyBtns from './MyBtns';
import Myhead from './Myhead';
import { GetQuery } from 'Pub/js/utils';
import './index.less';
const { Content } = Layout;

/**
 * 区域配置页面 
 */
class ZoneRegister extends Component {
	constructor(props) {
		super(props);
		
	}
	componentWillUnmount(){
		this.props.clearData();
	}
	/** 
	* 获取页面具体数据 
	*/
	componentDidMount() {
		let param = GetQuery(this.props.location.search);
		this.props.setZoneTempletid(param.templetid);
		let url, data;
		url = '/nccloud/platform/templet/queryallarea.do';
		data = {
			templetid: param && param.templetid
		};
		if (param.templetid){
			Ajax({
				url: url,
				data: data,
				info: {
					name: '区域设置',
					action: '传递区域数值'
				},
				success: ({ data }) => {
					if (data.success && data.data) {
						this.props.setZoneData(data.data);
						this.props.setNewList(data.data.areaList);
					} else {
						Notice({ status: 'error', msg: data.data.true });
					}
				}
			});
		}
	}

	render() {
		return (
			<PageLayout className="nc-workbench-zone">
				<Layout>
					<Myhead />
					<Layout>
						<MyBtns />
						<Layout height={'100%'}>
							<Content style={{ padding: '20px', minHeight: 280 }}>
								<ModuleFromCard />
								<div className="gap" />
								<ZoneTable />
							</Content>
						</Layout>
					</Layout>
				</Layout>
			</PageLayout>
		);
	}
}
export default connect((state) => ({}), {
	setZoneData,
	setZoneTempletid,
	setNewList,
	clearData
})(ZoneRegister);
