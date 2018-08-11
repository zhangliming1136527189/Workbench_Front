import * as mr from './action-type';
import renameActionType from 'Store/renameActionType';
renameActionType(mr,'mr');

let defaultState = {
	menuItemData: {
		"pk_menu": "",
		"menucode": "",
		"menuname": "",
		"menudesc": "",
		"isenable": false,
		"isdefault": false,
		"creator": "",
		"creationtime": "",
		"modifier": "",
		"modifiedtime": "",
	}
};
// 首页表单数据
export const menuRegisterData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case mr.MENUDATA:
			return { ...state,
				menuItemData: { ...action.value
				}
			};
		default:
			return state;
	}
};