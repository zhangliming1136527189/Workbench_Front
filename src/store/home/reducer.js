import * as home from './action-type';

let defaultState = {
	type: '', // 类型
	path: '', // js 相对路径
	position: '', // 小部件位置
	module: '', // 模块编码
	mountId: '', // 小部件挂载id
	row: '', // 行
	col: '', // 列
	
};
// 首页表单数据
export const homeData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case home.CLEARDATA:
			return { ...state, ...defaultState };
		default:
			return state;
	}
};
