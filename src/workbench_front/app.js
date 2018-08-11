import "babel-polyfill";
import 'core-js/es6/map';
import 'core-js/es6/set';
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import PropTypes from "prop-types";
import Ajax from "Pub/js/ajax";
import $NCPE from "Pub/js/pe";
import { initAppData } from "Store/appStore/action";
import store from "./store";
import Routes from "./routes";
import Notice from "Components/Notice";
import moment from "moment";
import { openApp } from "Pub/js/superJump";
import "moment/locale/zh-cn";
import "Assets/iconfont/iconfont.js";
import "Pub/css/public.less";
import "./theme/theme.less";
moment.locale("zh-cn");
window.proxyAction = $NCPE.proxyAction;

class App extends Component {
    constructor(props) {
        super(props);
    }
    /**
     * 打开应用
     * @param {Object} appOption - 应用对象
     * @param {String} type - 打开类型 current - 当前页面打开
     * @param {String} query - 需要传递的参数
     */
    openNewApp = (appOption, type, query) => {
        let win;
        if (type !== "current") {
            win = window.open("", "_blank");
        }
        let { appcode, appid, menuitemcode, name } = appOption;
        Ajax({
            url: `/nccloud/platform/appregister/openapp.do`,
            info: {
                name: name,
                action: "权限校验"
            },
            data: {
                appcode,
                menucode: menuitemcode
            },
            success: ({ data: { data } }) => {
                if (data) {
                    if (!data.is_haspower) {
                        Notice({
                            status: "error",
                            msg: data.hint_message
                        });
                        win.close();
                        return;
                    }
                    if (data.pageurl && data.pageurl.length > 0) {
                        // 应用菜单名
                        window.peData.nodeName = data.menu;
                        // 应用编码
                        window.peData.nodeCode = appcode;
                        // 用户id  由于需要知道具体哪个人所以将userid字段改成userCode 此处需要注意
                        window.peData.userID = window.GETBUSINESSINFO().userCode;
                        // 项目编码 
                        window.peData.projectCode =
                            window.GETBUSINESSINFO().projectCode;
                        // 打开应用
                        proxyAction(openApp, this, "打开应用")(
                            win,
                            appcode,
                            appid,
                            data.pagecode,
                            type,
                            query,
                            data
                        );
                    } else {
                        win.close();
                        Notice({
                            status: "error",
                            msg: "请确认当前应用是否设置默认页面！"
                        });
                        return;
                    }
                }
            }
        });
    };
    componentWillMount() {
        /**
         * 为spr统计提供基本信息
         */
        window.peData = {};
        /**
         * 在新页签中打开
         * @param　{Object} appOption // 应用 描述信息 name 和 code 及 pk_appregister
         * @param　{String} type // current - 浏览器新页签打开 不传参数在当前页打开
         * @param {String} query - 需要传递的参数 需要字符串拼接 如 &a=1&b=2
         */
        window.openNew = (appOption, type, query) => {
            if (typeof appOption === "object") {
                this.openNewApp(appOption, type, query);
            }
        };
        
        /**
         * 跳转检查
         * 调用此方法去修改URL地址时需要encodeURIComponent两次
         * 获取URL参数时需要decodeURIComponent两次
         * @param {String|undefined|null} appcode - 应用编码 值为""/undefined/null 则不会校验权限  需要工作台容器
         * @param {String|undefined|null} pagecode - 页面编码编码 值为""/undefined/null 则返回应用默认页面
         * @param {Function} callback - 检查之后的回调
         * @param {String} tab - 新页签
         */
        window.openCheck = (appcode,pagecode, callback, type) => {
            let win = window;
            // 新页签跳转
            if (type === "tab") {
                win = window.open("", "_blank");
            }
            // 需要校验权限
            if (appcode && appcode.length) {
                Ajax({
                    url: `/nccloud/platform/appregister/openapp.do`,
                    info: {
                        name: "工作桌面",
                        action: "权限校验"
                    },
                    data: {
                        appcode,
                        pagecode
                    },
                    success: ({ data }) => {
                        if (data.data && !data.data.is_haspower) {
                            if (type === "tab") {
                                win.close();
                            }
                            Notice({
                                status: "error",
                                msg: data.hint_message
                            });
                            return;
                        }
                        // 应用菜单名
                        window.peData.nodeName = data.data.menu;
                        // 应用编码
                        window.peData.nodeCode = appcode;
                        // 用户id 由于需要知道具体哪个人所以将userid字段改成userCode 此处需要注意
                        window.peData.userID = window.GETBUSINESSINFO().userCode;
                        // 项目编码
                        window.peData.projectCode =
                            window.GETBUSINESSINFO().projectCode;
                        /**
                         * 校验回调
                         * @param {Object} win - 窗口对象
                         * @param {Object} data - 检验之后的参数
                         */
                        proxyAction(callback, this, "打开应用")(win, data);
                    }
                });
            } else {
                // 不需要校验跳转权限且需要工作台容器
                /**
                 * 校验回调
                 * @param {Object} win - 窗口对象
                 */
                callback(win);
            }
        };
    }
    componentDidMount() {
        // 模拟数据，应该在此处进行数据请求，返回用户初始信息
        let data = {
            lang: "zh-CN",
            userInfo: "小明"
        };
        this.props.initAppData(data);
        // sessionStorage.setItem("gzip",0);
        let gzipSwitch = sessionStorage.getItem("gzip");
        if (!gzipSwitch) {
            Ajax({
                url: `/nccloud/platform/gzip/switch.do`,
                switchKey: true,
                info: {
                    name: "流量压缩开关",
                    action: "查询"
                },
                success: ({ data: { data } }) => {
                    sessionStorage.setItem("gzip", data ? 1 : 0);
                }
            });
        }
    }
    render() {
        return <Routes />;
    }
}
App.propTypes = {
    initAppData: PropTypes.func.isRequired
};
const AppStore = connect(
    state => ({ ifrData: state.ifrData }),
    {
        initAppData
    }
)(App);
ReactDOM.render(
    <Provider store={store}>
        <AppStore />
    </Provider>,
    document.querySelector("#ncc")
);
