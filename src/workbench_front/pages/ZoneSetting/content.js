import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSelectCard, updateAreaList, clearData } from 'Store/ZoneSetting/action';
import Ajax from 'Pub/js/ajax';
import './index.less';
import withDragDropContext from 'Pub/js/withDragDropContext';
import AreaItem from './areaItem';
import TreeModal from './treeModal';
import _ from 'lodash';
import Notice from 'Components/Notice';
//内容
class MyContent extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			modalVisible: false,
			metaTree: [],
			targetAreaID: '',
			targetAreaType:'',
			canSelectTreeNodeList:[]
		};
	}
	componentWillUnmount(){
		this.props.clearData();
	}
	componentDidMount() {
		Ajax({
			url: `/nccloud/platform/templet/querytempletpro.do`,
			info: {
				name: '单据模板设置',
				action: '配置模板区域-配置区域查询'
			},
			data: {
				templetid: this.props.templetid
			},
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success && data && data.length >= 0) {
						let areaList = [];
						// 实施态 
						if (this.props.status ==='searchTemplate'){
							_.forEach(data, (d) => {
								let tmpArea = {
									...d
								}
								if (tmpArea.areatype === '0') {
									areaList.push(tmpArea)
								}
							
							})
						} else if (this.props.status ==='templateSetting'){
							_.forEach(data, (d) => {
								let tmpArea = {
									...d
								}
								if (tmpArea.areatype !== '0') {
									tmpArea.queryPropertyList = d.formPropertyList;
									_.forEach(tmpArea.queryPropertyList, (q) => {
										q.pk_query_property = q.pk_form_property,
											q.myMetaPath = ''
									})
								}
								areaList.push(tmpArea)
							})
						} else if (this.props.status ==='templateSetting-unit'){
							_.forEach(data, (d) => {
								let tmpArea = {
									...d
								}
								if (tmpArea.areatype !== '0') {
									tmpArea.queryPropertyList = d.formPropertyList;
									_.forEach(tmpArea.queryPropertyList, (q) => {
										q.pk_query_property = q.pk_form_property,
											q.myMetaPath = ''
									})
								}
								areaList.push(tmpArea)
							})
						}
						// 开发态
						else{
							_.forEach(data, (d) => {
								let tmpArea = {
									...d
								}
								if (tmpArea.areatype !== '0') {
									tmpArea.queryPropertyList = d.formPropertyList;
									_.forEach(tmpArea.queryPropertyList, (q) => {
										q.pk_query_property = q.pk_form_property,
											q.myMetaPath = ''
									})
								}
								areaList.push(tmpArea)
							})
						}	
						this.props.updateAreaList(areaList)
					}
				}
			}
		});
	}
	addMetaInArea = (metaid, targetAreaID,areatype) => {
		Ajax({
			url: `/nccloud/platform/templet/querymetapro.do`,
			info: {
				name: '单据模板设置',
				action: '元数据树结构查询'
			},
			data: {
				metaid: metaid
			},
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success && data && data.rows && data.rows.length > 0) {
						let metaTree = [];
						data.rows.map((r,index) => {
							metaTree.push({
								...r,
								title:`${r.refcode} ${r.refname}` ,
								key: `${r.refcode}`,
								myUniqID: `${r.refcode}`,
								isLeaf:r.isleaf
							});
						});
						let canSelectTreeNodeList = [];
						_.forEach(metaTree,(m)=>{
							if(m.datatype==='205'){
								canSelectTreeNodeList.push(m);
							}
						})
						this.setState({ metaTree: metaTree, targetAreaID: targetAreaID,targetAreaType:areatype, canSelectTreeNodeList: canSelectTreeNodeList});
						this.setModalVisible(true);
					}else{
						if (success && data && data.rows && !data.rows.length){
							Notice({ status: 'warning', msg: '元数据树为空' });
						}
					}
				}
			}
		});
	};

	updateMetaTreeData = (metaTree)=>{
		this.setState({metaTree:metaTree});
	}

	addCard = (addCardList) => {
		let {targetAreaID } = this.state;
		let {areaList} = this.props;
        areaList = _.cloneDeep(areaList);
		let targetAreaIndex = -1;
		let metaid = '';
        _.forEach(areaList ,(a,i)=>{
            if(targetAreaID === a.pk_area){
				targetAreaIndex = i;
				metaid = a.metaid;
                return false;
            }
        })
		areaList[targetAreaIndex].queryPropertyList = _.uniqBy(areaList[targetAreaIndex].queryPropertyList.concat(addCardList),'code');

		_.forEach(areaList[targetAreaIndex].queryPropertyList,(q,i)=>{
			q.position = i+1;
			q.classid = metaid;
		});
        this.props.updateAreaList(areaList)
    };

	moveCard = (dragIndex, hoverIndex, areaItemIndex) => {
		let { areaList } = this.props;
		areaList = _.cloneDeep(areaList);
		const cards = areaList[areaItemIndex].queryPropertyList;

		const dragCard = cards[dragIndex];
		cards.splice(dragIndex, 1);
		cards.splice(hoverIndex, 0, dragCard);
		_.forEach(cards,(q,i)=>{
			q.position = i+1;
		});
		this.props.updateAreaList(areaList)
		this.props.updateSelectCard({})
	};

	deleteCard = (cardIndex, areaItemIndex) => {
		let { areaList } = this.props;
		areaList = _.cloneDeep(areaList);

		const cards = areaList[areaItemIndex].queryPropertyList;

		cards.splice(cardIndex, 1);

		this.props.updateAreaList(areaList)
		this.props.updateSelectCard({})
	};

	setModalVisible = (modalVisible) => {
		this.setState({ modalVisible });
	};


	selectThisCard =(cardIndex, areaItemIndex)=>{
		let { areaList } = this.props;
		let card = areaList[areaItemIndex].queryPropertyList[cardIndex];
		this.props.updateSelectCard(card)
	};

	render() {
		return (
			<div className='template-setting-content'>
				{this.props.areaList.map((a, i) => {
					return (
						<AreaItem
							areaItem={a}
							key={i}
							areaListLength={this.props.areaList.length}
                            id={a.pk_area}
							index={i}
							areatype = {a.areatype}
							metaid={a.metaid}
							moveCard={this.moveCard}
							deleteCard={this.deleteCard}
							addMetaInArea={this.addMetaInArea}
							selectThisCard = {this.selectThisCard}
						/>
					);
				})}

				<TreeModal
					metaTree={this.state.metaTree}
                    canSelectTreeNodeList={this.state.canSelectTreeNodeList}
					modalVisible={this.state.modalVisible}
					targetAreaID = {this.state.targetAreaID}
					targetAreaType = {this.state.targetAreaType}
					targetAreaCardLength = {this.state.targetAreaCardLength}
					setModalVisible={this.setModalVisible}
					addCard = {this.addCard}
					updateMetaTreeData = {this.updateMetaTreeData}
				/>
			</div>
		);
	}
}
export default connect((state) => ({
	areaList: state.zoneSettingData.areaList
}), {
		clearData,
	updateAreaList,
	updateSelectCard
})(withDragDropContext(MyContent));
