import * as appStore from "./action-type";
import renameActionType from "Store/renameActionType";
import UserLogo from "Assets/images/userLogo.jpg";
renameActionType(appStore, "appStore");

let defaultState = {
    lang: "zh-CN",
    userInfo: "xxx",
    intlDone: false,
    userLogo: UserLogo,
    isOpen: false,
    userID: "0001Z51000000005I123",
    userName: "用户名称"
};
// 首页表单数据
export const appData = (state = defaultState, action = {}) => {
    switch (action.type) {
        case appStore.INITAPPDATA:
            return { ...state, ...action.value };
        case appStore.CHANGELANG:
            return { ...state, ...{ intlDone: action.value } };
        case appStore.DRAWEROPEN:
            return { ...state, ...{ isOpen: action.value } };
        case appStore.ACCOUNTINFO:
            return { ...state, ...action.value };
        default:
            return state;
    }
};
