import React, { Component } from "react";
import { Button, Layout, Popconfirm } from "antd";
import { connect } from "react-redux";
import { setZoneData } from "Store/Zone/action";
import Ajax from "Pub/js/ajax";
import { GetQuery } from "Pub/js/utils";
import Notice from "Components/Notice";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { openPage } from "Pub/js/superJump";
const { Header } = Layout;

/**
 * 工作桌面 配置模板区域
 */
const Btns = [
    {
        name: "保存"
    },
    {
        name: "下一步",
        type: "primary"
    }
];

class MyBtns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            siderHeight: "280",
            state: "browse"
        };
    }

    // 根据不同的按钮 绑定对应的事件
    creatBtns(Btns) {
        return (
            Btns &&
            Btns.map((item, index) => {
                return (
                    <Button
                        key={index}
                        className="margin-left-10"
                        type={item.type}
                        onClick={this.handleClick.bind(this, item.name)}
                    >
                        {item.name}
                    </Button>
                );
            })
        );
    }

    // 校验tableCode
    validateCode(list) {
        let foreCheck,
            afterCheck,
            result = true;
        foreCheck = list && list.length;
        afterCheck = _.uniqBy(list, "code") && _.uniqBy(list, "code").length;

        // 校验code重复
        if (foreCheck > afterCheck) {
            Notice({ status: "warning", msg: "区域编码不能重复" });
            result = false;
            return result;
        }

        // 校验为空
        _.forEach(list, (v, i) => {
            if (!v.code || !v.name) {
                Notice({ status: "warning", msg: "区域编码或名称不能为空" });
                result = false;
                return result;
            }
        });
        return result;
    }

    // 保存 区域数据
    saveZoneData(list, form, type) {
        let param = GetQuery(this.props.location.search);
        let url, datas;
        url = "/nccloud/platform/templet/settempletarea.do";
        let { zoneDatas } = this.props;
        datas = {
            pk_page_templet: zoneDatas.pk_page_templet,
            pagecode: zoneDatas.pagecode || param.pcode,
            pageid: zoneDatas.pageid || param.pid,
            parentid: zoneDatas.parentid || "root",
            areaList: list,
            isdefault: zoneDatas.isdefault,
            appcode: param.appcode || zoneDatas.appcode,
            clazz: zoneDatas.clazz,
            mateid: zoneDatas.mateid,
            ...form
        };

        //  校验 表格的合法性
        let validateResult = this.validateCode(list);
        if (validateResult) {
            Ajax({
                url: url,
                data: datas,
                info: {
                    name: "保存区域",
                    action: "保存区域设置"
                },
                success: ({ data }) => {
                    if (data.success && data.data) {
                        this.props.setZoneData({});
                        // type =1 代表保存  type =2 表示下一步
                        type === 1
                            ? openPage(
                                  `/ar`,
                                  false,
                                  {
                                      b1: "动态建模平台",
                                      b2: "开发配置",
                                      b3: "应用管理",
                                      n: "应用注册",
                                      c: "102202APP"
                                  },
                                  ["templetid", "appcode", "pcode", "pid"]
                              )
                            : openPage(`/ZoneSetting`, false, {
                                  templetid: data.data.templetid,
                                  pcode: datas.pagecode,
                                  pid: datas.pageid,
                                  appcode: datas.appcode
                              });
                    }
                }
            });
        }
    }

    // 处理按钮的事件
    handleClick(name) {
        let { zoneDatas } = this.props;
        let param = GetQuery(this.props.location.search);
        let fromData = this.props.zoneFormData();
        let { newListData } = this.props;
        switch (name) {
            case "保存":
                if ((!fromData)||(!zoneDatas)) {//
                    Notice({ status: 'warning', msg: '清完善表格和表单信息' });
                    return;
                }
                this.saveZoneData(newListData, fromData, 1);
                break;
            case "下一步":
                if ((!fromData)||(!zoneDatas)) {//
                    Notice({ status: 'warning', msg: '清完善表格和表单信息' });
                    return;
                }
                this.saveZoneData(newListData, fromData, 2);
                break;
            case "取消":
                openPage(
                    `/ar`,
                    false,
                    {
                        b1: "动态建模平台",
                        b2: "开发配置",
                        b3: "应用管理",
                        n: "应用注册",
                        c: "102202APP"
                    },
                    ["templetid", "appcode", "pcode", "pid"]
                );
                break;
            case "返回":
                history.back();
                break;
        }
    }
    render() {
        return (
            <Header>
                <div className="myHead">
                    <div>
                        <span>基本信息</span>
                    </div>
                    <div>
                        <Popconfirm
                            title="确定取消配置？"
                            onConfirm={this.handleClick.bind(this, "取消")}
                            placement="top"
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button className="margin-left-10">取消</Button>
                        </Popconfirm>
                        {this.creatBtns(Btns)}
                    </div>
                </div>
            </Header>
        );
    }
}
MyBtns = withRouter(MyBtns);
export default connect(
    state => {
        let { zoneFormData, newListData, zoneDatas } = state.zoneRegisterData;
        return {
            zoneFormData,
            newListData,
            zoneDatas
        };
    },
    {
        setZoneData
    }
)(MyBtns);
