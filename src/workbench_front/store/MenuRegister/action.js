import * as mr from './action-type';

// 菜单数据
export const updateMenuItemData = (value) => {
	return {
		type: mr.MENUDATA,
		value
	};
};


