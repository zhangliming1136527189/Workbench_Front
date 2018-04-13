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
