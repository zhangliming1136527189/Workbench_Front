import * as appStore from './action-type';

// 初始化应用数据
export const initAppData = (value) => {
	return {
		type: appStore.INITAPPDATA,
		value
	};
};
// 切换语言
export const changeIntlData = (value) => {
	return {
		type: appStore.CHANGELANG,
		value
	};
};
// 个人信息栏是否展开
export const changeDrawer = (value) => {
	return {
		type: appStore.DRAWEROPEN,
		value
	};
};
// 账户信息
export const setAccountInfo = (value) => {
	return {
		type: appStore.ACCOUNTINFO,
		value
	};
};
