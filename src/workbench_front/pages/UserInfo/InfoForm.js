import React, { Component } from "react";
import { Row, Col } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
class InfoForm extends Component {
    constructor(props) {
        super(props);
    }
    handleClick = infoType => {
        this.props.infoSetting(infoType);
    };
    render() {
        let { picture, userName, phone, email, userLogo } = this.props;
        return (
            <div className="userinfo-container">
                <div className="userinfo-content">
                    <div className="title info margin-bottom-12">个人信息</div>
                    <div className="item border-bottom picture">
                        <label className="label">头像</label>
                        <div className="item-content">
                            <div className="userlogo">
                                <img src={userLogo} width="64" height="64" />
                                <i className="iconfont icon-bianji" />
                            </div>
                        </div>
                    </div>
                    <div className="item border-bottom name">
                        <label className="label">姓名</label>
                        <div className="item-content">
                            <span>{userName}</span>
                        </div>
                    </div>
                    <div className="title margin-bottom-12">
                        <span>登录账号</span>
                    </div>
                    <div className="item border-bottom name">
                        <label className="label">联系电话</label>
                        <div className="item-content">
                            {phone.length > 0 ? (
                                <span>{phone}</span>
                            ) : (
                                <span className="not-setting">
                                    未设置
                                    <i className="iconfont icon-jinggao" />
                                </span>
                            )}
                            <span
                                className="btn"
                                onClick={() => {
                                    this.handleClick("1");
                                }}
                            >
                                {phone.length > 0 ? "修改" : "绑定手机号"}
                            </span>
                        </div>
                    </div>
                    <div className="item border-bottom name">
                        <label className="label">电子邮箱</label>
                        <div className="item-content">
                            {email.length > 0 ? (
                                <span>{email}</span>
                            ) : (
                                <span className="not-setting">
                                    未设置
                                    <i className="iconfont icon-jinggao" />
                                </span>
                            )}
                            <span
                                className="btn"
                                onClick={() => {
                                    this.handleClick("2");
                                }}
                            >
                                {email.length > 0 ? "修改" : "绑定邮箱"}
                            </span>
                        </div>
                    </div>
                    <div className="title margin-bottom-12">
                        <span>账号密码</span>
                    </div>
                    <div className="item border-bottom pw">
                        <label className="label">密码</label>
                        <div className="item-content">
                            <span>******</span>
                            <span
                                className="btn"
                                onClick={() => {
                                    this.handleClick("0");
                                }}
                            >
                                修改
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
InfoForm.propTypes = {
    userName: PropTypes.string.isRequired
};
export default connect(
    state => ({
        userName: state.appData.userName,
        userLogo: state.appData.userLogo
    }),
    {}
)(InfoForm);
