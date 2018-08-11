import * as actionType from './action-type';
// 清空数据
export const clearData = () => {
	return {
		type: actionType.CLEARDATA
	};
};
// 初始化数据
export const updateShadowCard = (shadowCard) => {
	return {
		type: actionType.UPDATESHADOWCARD,
		shadowCard: shadowCard
	};
};
//更新GroupList数据
export const updateGroupList = (groups) => {
	return {
		type: actionType.UPDATEGROUPLIST,
		groups: groups
	};
};
//更新正在编辑的分组ID
export const updateCurrEditID = (currEditID) => {
	return {
		type: actionType.UPDATECURREDITID,
		currEditID: currEditID
	};
};
//更新Layout
export const updateLayout = (layout) => {
	return {
		type: actionType.UPDATELAYOUT,
		layout: layout
	};
};
//
