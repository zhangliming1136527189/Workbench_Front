import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Drawer from "react-motion-drawer";
import { Modal } from "antd";
import { changeDrawer } from "Store/appStore/action";
import UserLogo from "Assets/images/userLogo.jpg";
import { openPage } from "Pub/js/superJump";
import Notice from "Components/Notice";
import Ajax from "Pub/js/ajax";
import { sprLog } from "./spr";
class SideDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sprType: true
        };
    }
    handleDrawerChange = isOpen => {
        this.props.changeDrawer(isOpen);
    };
    /**
     * 侧边栏当前页跳转页面
     * 采用单页路由方式
     * @param {Object} param 跳转目标页需要传递的参数
     * @param {String} uri 跳转目标页面路由
     */
    handeleSkipPage = (uri, param) => {
        let { isOpen } = this.props;
        openPage(uri, false, param);
        this.props.changeDrawer(!isOpen);
    };
    logout=()=>{
        Ajax({
            url: `/nccloud/riart/login/logout.do`,
            info: {
                name: "工作桌面",
                action: "注销"
            },
            success: () => {
                Ajax({
                    url: `/nccloud/platform/appregister/querypersonsettings.do`
                });
                sessionStorage.removeItem("gzip");
            }
        });
    }
    /**
     * 注销操作
     */
    handleExit = () => {
        this.props.changeDrawer(false);
        Modal.confirm({
            closable: false,
            title: "注销",
            maskClosable: true,
            content: "注销当前账号？",
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
                window.proxyAction(this.logout, this, "注销")();
            }
        });
    };
    /**
     * spr录制
     */
    handleSprClick = () => {
        let { sprType } = this.state;
        sprType = sprLog(sprType, sprType => {
            this.setState({ sprType });
        });
    };
    /**
     * 联系用友服务人员
     */
    sysinitAccessorAction = () => {
        let win = window.open("", "_blank");
        Ajax({
            url: `/nccloud/baseapp/param/paQry.do`,
            data: {
                initCodes: "ISMURL"
            },
            info: {
                name: "首页",
                action: "联系服务人员"
            },
            success: ({ data: { data } }) => {
                if (data) {
                    win.location.href = `${window.location.protocol}//${data}`;
                } else {
                    win.close();
                    Notice({
                        status: "error",
                        msg: "请联系系统管理员配置本地ism服务器ip地址！"
                    });
                }
            }
        });
    };
    render() {
        let { isOpen } = this.props;
        let { sprType } = this.state;
        return (
            <div className="nc-workbench-drawer">
                <Drawer
                    className="drawer-content"
                    width={430}
                    overlayColor={"none"}
                    drawerStyle={{
                        top: "48px",
                        border: "1px solid rgba(78, 89, 104, 0.19)",
                        boxShadow: "3px 6px 8px 0px rgba(74,81,93,0.25)",
                        borderRadius: "2px 3px 3px 0px"
                    }}
                    open={isOpen}
                    onChange={this.handleDrawerChange}
                >
                    <div className="drawer-exit">
                        <i
                            field="logout"
                            fieldname="注销"
                            title="注销"
                            className="iconfont icon-zhuxiao"
                            onClick={this.handleExit}
                        />
                    </div>
                    <div className="drawer-info">
                        <div className="info">
                            <div className="drawer-logo">
                                <img src={UserLogo} alt="logo" />
                            </div>
                            <span className="name">{this.props.userName}</span>
                        </div>
                    </div>
                    <div className="drawer-setting">
                        <div className="setting-content">
                            <div
                                onClick={() => {
                                    this.handeleSkipPage("/ds", {
                                        n: "桌面设置"
                                    });
                                }}
                                className="setting-btn"
                            >
                                <i className="iconfont icon-bianji" />
                                <span field="setting" fieldname="桌面设置">
                                    桌面设置
                                </span>
                            </div>
                            <div
                                onClick={() => {
                                    this.handeleSkipPage("/ui", {
                                        n: "账户设置"
                                    });
                                }}
                                className="setting-btn"
                            >
                                <i className="iconfont icon-shezhi" />
                                <span field="account" fieldname="账户设置">
                                    账户设置
                                </span>
                            </div>
                            <div
                                onClick={() => {
                                    this.handeleSkipPage("/c", {
                                        n: "个性化设置"
                                    });
                                }}
                                className="setting-btn"
                            >
                                <i
                                    field="logout"
                                    fieldname="注销"
                                    className="iconfont icon-shezhi"
                                />
                                <span field="customize" fieldname="个性化设置">
                                    个性化设置
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="drawer-link">
                        <ul className="link">
                            <li>
                                <span field="help" fieldname="帮助">
                                    帮助
                                </span>
                            </li>
                            <li>
                                <span
                                    field="contact"
                                    fieldname="用友服务支持"
                                    onClick={this.sysinitAccessorAction}
                                >
                                    用友服务支持
                                </span>
                            </li>
                            <li>
                                <span field="register" fieldname="用友云注册">
                                    用友云注册
                                </span>
                            </li>
                            {/* <li>
                                <span
                                    field="spr"
                                    fieldname="录制SPR"
                                    onClick={this.handleSprClick}
                                >
                                    {sprType ? `开始录制SPR` : `结束录制SPR`}
                                </span>
                            </li> */}
                            <li>
                                <span field="log" fieldname="日志">
                                    日志
                                </span>
                            </li>
                        </ul>
                    </div>
                </Drawer>
            </div>
        );
    }
}
SideDrawer.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    userName: PropTypes.string.isRequired,
    changeDrawer: PropTypes.func.isRequired
};
export default connect(
    state => ({
        isOpen: state.appData.isOpen,
        userName: state.appData.userName
    }),
    {
        changeDrawer
    }
)(withRouter(SideDrawer));
