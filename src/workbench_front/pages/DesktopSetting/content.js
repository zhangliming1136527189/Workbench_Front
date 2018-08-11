import React, { Component } from 'react';
import _ from 'lodash';
import './index.less';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { updateShadowCard, updateGroupList, updateCurrEditID, updateLayout } from 'Store/test/action';
//自定义组件
import { layoutCheck } from './collision';
import { compactLayout, compactLayoutHorizontal } from './compact';
import * as utilService from './utilService';
import GroupItem from './groupItem';
import MyContentAnchor from './anchor';
import MyFooter from './footer';
import { scroller } from 'react-scroll';

let resizeWaiter = false;

class MyContent extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	//拖拽中卡片在组上移动
	moveCardInGroupItem = (dragItem, hoverItem, x, y) => {
		let groups = this.props.groups;
		let shadowCard = this.props.shadowCard;
		const { margin, containerWidth, col, rowHeight } = this.props.layout;
		const { gridX, gridY } = utilService.calGridXY(x, y, shadowCard.width, margin, containerWidth, col, rowHeight);
		if (gridX === shadowCard.gridx && gridY === shadowCard.gridy) {
			return;
		}
		let groupIndex = hoverItem.index;
		//先判断组内有没有相同的appID
		const cardid = shadowCard.cardid;
		const isContain = utilService.checkCardContainInGroup(groups[groupIndex], cardid);

		if (isContain) {
			return;
		}

		_.forEach(groups, (g, index) => {
			_.remove(g.apps, (a) => {
				return a.isShadow === true;
			});
		});

		shadowCard = { ...shadowCard, gridx: gridX, gridy: gridY };

		groups[groupIndex].apps.push(shadowCard);

		const newlayout = layoutCheck(
			groups[groupIndex].apps,
			shadowCard,
			shadowCard.cardid,
			shadowCard.cardid
		);

		const compactedLayout = compactLayout(newlayout, shadowCard);
		groups[groupIndex].apps = compactedLayout;
		this.props.updateShadowCard(shadowCard);
		this.props.updateGroupList(groups);
	};
	/*
	 * 工作桌面 用户桌面设置 页面
	 * 关于组的操作
	 */
	//移动组顺序
	moveGroupItem = (dragIndex, hoverIndex) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		const dragCard = groups[dragIndex];
		groups.splice(dragIndex, 1);
		groups.splice(hoverIndex, 0, dragCard);
		this.props.updateGroupList(groups);
	};
	//释放分组到分组
	onDrop = (dragItem, dropItem) => {
		if (dragItem.type === dropItem.type) {
			return;
		}
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		let card;
		let dropGroupIndex, dragCardIndex, dragCardFromGroupIndex;
		for (let i = 0, len = groups.length; i < len; i++) {
			if (groups[i].pk_app_group === dropItem.id) {
				dropGroupIndex = i;
			}
			for (let j = 0, len2 = groups[i].apps.length; j < len2; j++) {
				let apps = groups[i].apps;
				if (apps[j].cardid === dragItem.id) {
					card = apps[j];
					dragCardIndex = j;
					dragCardFromGroupIndex = i;
				}
			}
		}
		groups[dragCardFromGroupIndex].apps.splice(dragCardIndex, 1);
		groups[dropGroupIndex].apps.push(card);
		this.props.updateGroupList(groups);
	};
	//释放卡片到分组
	onCardDropInGroupItem = (dragItem, dropItem) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		const targetGroupIndex = dropItem.index;
		const cardList = dragItem.cardList;

		utilService.setPropertyValueForCards(groups, 'isShadow', false);
		//目标组内重新布局
		_.forEach(groups, (g, targetGroupIndex) => {
			let compactedLayout = compactLayoutHorizontal(groups[targetGroupIndex].apps, this.props.col);
			groups[targetGroupIndex].apps = compactedLayout;
		});

		this.props.updateGroupList(groups);
		this.props.updateShadowCard({});
	};
	//释放CardList到分组中
	onCardListDropInGroupItem = (dragItem, dropItem) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		const targetGroupIndex = dropItem.index;
		const cardList = dragItem.cardList;

		groups[targetGroupIndex].apps = _.concat(groups[targetGroupIndex].apps, cardList);
		groups[targetGroupIndex].apps = _.uniqBy(groups[targetGroupIndex].apps, 'cardid');
		//目标组内重新布局
		let compactedLayout = compactLayoutHorizontal(groups[targetGroupIndex].apps, this.props.col);

		groups[targetGroupIndex].apps = compactedLayout;

		this.props.updateGroupList(groups);
	};
	//初始化组
	initGroupItem(groups) {
		let itemDoms = [];
		if (groups.length === 0) {
			itemDoms.push(
				<div key={0} className='first-add' id='first-add'>
					<Button className='group-item-add' onClick={this.addFirstGroupItem}>
						{' '}
						+ 添加分组
					</Button>
				</div>
			);
		} else {
			itemDoms = groups.map((g, i) => {
				return (
					<GroupItem
						key={g.pk_app_group}
						id={g.pk_app_group}
						type={g.type}
						index={i}
						cards={g.apps}
						length={groups.length}
						groupname={g.groupname}
						moveCardInGroupItem={this.moveCardInGroupItem}
						onDrop={this.onDrop}
						onCardDropInGroupItem={this.onCardDropInGroupItem}
						onCardListDropInGroupItem={this.onCardListDropInGroupItem}
						moveGroupItem={this.moveGroupItem}
						upGroupItem={this.upGroupItem}
						downGroupItem={this.downGroupItem}
						deleteGroupItem={this.deleteGroupItem}
						addGroupItem={this.addGroupItem}
						changeGroupName={this.changeGroupName}
						getCardsByGroupIndex={this.getCardsByGroupIndex}
						handleLoad={this.handleLoad}
					/>
				);
			});
		}
		return itemDoms;
	}
	//向上移动组
	upGroupItem = (groupIndex) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		if (groupIndex === 0) {
			return;
		}
		const preGroup = groups[groupIndex - 1];
		groups[groupIndex - 1] = groups[groupIndex];
		groups[groupIndex] = preGroup;
		this.props.updateGroupList(groups);
	};
	//向下移动组
	downGroupItem = (groupIndex) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		if (groupIndex === groups.length - 1) {
			return;
		}
		const nextGroup = groups[groupIndex + 1];
		groups[groupIndex + 1] = groups[groupIndex];
		groups[groupIndex] = nextGroup;
		this.props.updateGroupList(groups);
	};
	//删除组
	deleteGroupItem = (groupID) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);

		_.remove(groups, (g) => {
			return g.pk_app_group === groupID;
		});
		this.props.updateGroupList(groups);
	};
	//添加第一个组
	addFirstGroupItem = () => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		let insertIndex;
		const tmpItem = {
			pk_app_group: 'newGroupItem' + new Date().getTime(),
			groupname: `分组`,
			type: 'group',
			apps: []
		};
		groups.push(tmpItem);
		this.props.updateGroupList(groups);
		this.props.updateCurrEditID(tmpItem.pk_app_group);
	};
	//添加组
	addGroupItem = (groupIndex) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		let insertIndex = groupIndex;
		const tmpItem = {
			pk_app_group: 'newGroupItem' + new Date().getTime(),
			groupname: `分组(${utilService.getNewGroupItemNum(groups)})`,
			type: 'group',
			apps: []
		};
		groups.splice(insertIndex + 1, 0, tmpItem);
		//更新数组redux之后，scroll滚动
		this.asyncUpdateGroupList(groups).then(() => {
			scroller.scrollTo(`a${tmpItem.pk_app_group}`, {
				offset: -139,
				spy: true,
				smooth: true,
				duration: 250,
				containerId: 'nc-workbench-home-container'
			});
		});
		this.props.updateCurrEditID(tmpItem.pk_app_group);
	};
	async asyncUpdateGroupList(groups) {
		let user = await this.props.updateGroupList(groups);
		return user;
	}
	//改变组名
	changeGroupName = (groupIndex, groupname) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		groups[groupIndex].groupname = groupname;
		this.props.updateGroupList(groups);
		this.props.updateCurrEditID('');
	};
	//通过Group Index获取cards
	getCardsByGroupIndex = (groupIndex) => {
		let { groups } = this.props;
		return groups[groupIndex].apps;
	};
	//当页面加载完成，获得卡片容器宽度
	handleLoad = () => {
		if (!resizeWaiter) {
			resizeWaiter = true;
			setTimeout(() => {
				console.info('resize！');
				resizeWaiter = false;
				let clientWidth;
				const containerDom = document.querySelector('#card-container');
				if (containerDom) {
					clientWidth = containerDom.clientWidth;
				} else {
					const firstAddButton = document.querySelector('#first-add');
					if (firstAddButton) {
						clientWidth = firstAddButton.clientWidth - 10;
					} else {
						return;
					}
				}
				const defaultCalWidth = this.props.defaultLayout.calWidth;
				const { containerPadding, margin } = this.props.layout;
				let layout = _.cloneDeep(this.props.layout);
				const windowWidth = window.innerWidth - 60 * 2;
				const col = utilService.calColCount(defaultCalWidth, windowWidth, containerPadding, margin);
				const calWidth = utilService.calColWidth(clientWidth, col, containerPadding, margin);

				let { groups } = this.props;
				groups = _.cloneDeep(groups);
				_.forEach(groups, (g) => {
					let compactedLayout = compactLayoutHorizontal(g.apps, col);
					g.apps = compactedLayout;
				});

				layout.calWidth = layout.rowHeight = calWidth;
				layout.col = col;
				layout.containerWidth = clientWidth;
				this.props.updateGroupList(groups);
				this.props.updateLayout(layout);
			}, 500);
		}
	};
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleLoad);
		console.log('移除window中resize fn');
	}
	componentDidMount() {
		window.addEventListener('resize', this.handleLoad);
	}
	render() {
		const { groups, relateidObj } = this.props;
		return (
			<div className='nc-desktop-setting-content'>
				<MyContentAnchor onCardListDropInGroupItem={this.onCardListDropInGroupItem} />
				<div className='nc-workbench-home-container' id='nc-workbench-home-container'>
					{this.initGroupItem(groups)}
				</div>
				<MyFooter relateidObj={relateidObj} />
			</div>
		);
	}
}

export default connect(
	(state) => ({
		groups: state.templateDragData.groups,
		shadowCard: state.templateDragData.shadowCard,
		layout: state.templateDragData.layout,
		defaultLayout: state.templateDragData.defaultLayout,
		col: state.templateDragData.layout.col
	}),
	{
		updateGroupList,
		updateShadowCard,
		updateCurrEditID,
		updateLayout
	}
)(MyContent);
