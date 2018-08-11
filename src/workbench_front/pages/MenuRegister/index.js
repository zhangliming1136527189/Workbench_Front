import React, { Component } from "react";
import { Button, Table, Switch, Popconfirm } from "antd";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import { updateMenuItemData } from "Store/MenuRegister/action";
import EditableCell from "Components/EditableCell";
import CoverPosotion from "Components/CoverPosition";
import Ajax from "Pub/js/ajax";
import { openPage } from "Pub/js/superJump";
import { PageLayout } from "Components/PageLayout";
import Notice from "Components/Notice";
import "./index.less";
/**
 * 表格表头必输项渲染
 * @param {String} title
 */
const RenderTableTitle = title => (
    <div>
        <span style={{ color: "#e14c46" }}>*</span>
        <span>{title}</span>
    </div>
);
class MenuRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isedit: false,
            listData: [],
            // 是否为开发态
            isDevelopMode: false
        };

        this.btnList = [
            {
                name: "修改",
                code: "edit",
                type: "primary",
                isedit: false
            },
            {
                name: "保存",
                code: "save",
                type: "primary",
                isedit: true
            },
            {
                name: "取消",
                code: "cancle",
                type: "",
                isedit: true
            }
        ];
        this.historyListData;
    }
    /**
     * 表格单元格编辑事件
     */
    handleCellChange = (key, index, value) => {
        const listData = [...this.state.listData];
        listData[index][key] = value;
        listData[index]["isModify"] = true;
        this.setState({
            listData
        });
    };
    /**
     * 表格单元格校验
     */
    handleCellCheck = (key, index, value) => {
        const listData = [...this.state.listData];
        if (!value || value.length === 0) {
            listData[index]["hasError"] = true;
            this.setState({
                listData
            });
            return {
                hasError: true
            };
        } else {
            // 菜单编码不能重复
            if (key === "menucode") {
                let itemList = listData.filter(item => item[key] === value);
                if (itemList.length > 1) {
                    listData[index]["hasError"] = true;
                    this.setState({
                        listData
                    });
                    return {
                        hasError: true,
                        cellErrorMsg: "菜单编码不能重复"
                    };
                }
            }
            listData[index]["hasError"] = false;
            this.setState({
                listData
            });
            return {
                hasError: false
            };
        }
    };
    /**
     * 列表行操作事件
     */
    handleListClick = (key, record, index) => {
        switch (key) {
            case "menuitem":
                this.props.updateMenuItemData(record);
                openPage("/mi", false, {
                    n: "菜单注册",
                    id: record.pk_menu,
                    mn: record.menuname,
                    mt: record.isdefault && !this.state.isDevelopMode ? 1 : 0
                });
                break;
            case "del":
                if (record.isdefault) {
                    Notice({
                        status: "warning",
                        msg: "系统预置的菜单不能删除！"
                    });
                    return;
                }
                if (record.isenable) {
                    Notice({
                        status: "warning",
                        msg: "已经启用的菜单不能删除！"
                    });
                    return;
                }
                Ajax({
                    url: `/nccloud/platform/appregister/deleteappmenu.do`,
                    info: {
                        name: "菜单注册",
                        action: "删除菜单"
                    },
                    data: {
                        pk_menu: record.pk_menu
                    },
                    success: res => {
                        let { data, success } = res.data;
                        if (success) {
                            let { listData } = this.state;
                            listData = listData.filter(
                                item => item.pk_menu !== record.pk_menu
                            );
                            this.setState({ listData });
                        }
                    }
                });
                break;
            case "copy":
                Ajax({
                    url: `/nccloud/platform/appregister/copyappmenu.do`,
                    info: {
                        name: "菜单注册",
                        action: "复制菜单"
                    },
                    data: {
                        pk_menu: record.pk_menu
                    },
                    success: res => {
                        let { data, success } = res.data;
                        if (success) {
                            let { listData } = this.state;
                            listData.splice(index, 0, data);
                            this.setState({ listData });
                        }
                    }
                });
                break;
            default:
                break;
        }
    };
    /**
     * 菜单停起用
     * @param {Boole} checked 停启用状态
     * @param {Object} record 停启用状态
     */
    handleChange = (checked, record) => {
        let { listData } = this.state;
        if (!checked) {
            Notice({ status: "warning", msg: "必须要有启用状态的菜单！" });
            return;
        }
        record.isenable = checked;
        Ajax({
            url: `/nccloud/platform/appregister/editappmenu.do`,
            info: {
                name: "菜单注册",
                action: "菜单停启用"
            },
            data: [{ ...record }],
            success: res => {
                let { success, data } = res.data;
                if (success && data) {
                    listData = listData.map(item => {
                        if (data[0].pk_menu === item.pk_menu) {
                            return { ...data[0] };
                        } else {
                            item.isenable = false;
                            return item;
                        }
                    });
                    this.setState({ listData });
                }
            }
        });
    };
    /**
     * 表头操作按钮事件
     */
    handleBtnClick = key => {
        switch (key) {
            case "save":
                let errorList = this.state.listData.filter(
                    item => item.hasError
                );
                if (errorList.length > 0) {
                    Notice({
                        status: "warning",
                        msg: "请检查必输项！"
                    });
                    return;
                }
                let modifyData = this.state.listData.filter(
                    item => item.isModify
                );
                Ajax({
                    url: `/nccloud/platform/appregister/editappmenu.do`,
                    data: modifyData,
                    info: {
                        name: "菜单注册",
                        action: "保存菜单"
                    },
                    success: res => {
                        let { success, data } = res.data;
                        if (success && data) {
                            let listData = this.state.listData;
                            listData = listData.map(item => {
                                let newData = data.find(
                                    newItem => newItem.pk_menu === item.pk_menu
                                );
                                if (newData) {
                                    item = newData;
                                }
                                return item;
                            });
                            this.setState({ listData, isedit: false });
                            Notice({
                                status: "success",
                                msg: "保存成功！"
                            });
                        } else {
                            Notice({
                                status: "error",
                                msg: data.data.true
                            });
                        }
                    }
                });
                break;
            case "edit":
                this.historyListData = _.cloneDeep(this.state.listData);
                this.setState({ isedit: true });
                break;
            case "cancle":
                this.setState({
                    listData: this.historyListData,
                    isedit: false
                });
                break;
            default:
                break;
        }
    };
    creatBtn = () => {
        return this.btnList.map((item, index) => {
            if (this.state.isedit) {
                if (item.isedit) {
                    return (
                        <Button
                            className="margin-left-10"
                            key={item.code}
                            type={item.type}
                            onClick={() => {
                                this.handleBtnClick(item.code);
                            }}
                        >
                            {item.name}
                        </Button>
                    );
                } else {
                    return null;
                }
            } else {
                if (item.isedit) {
                    return null;
                } else {
                    return (
                        <Button
                            className="margin-left-10"
                            key={item.code}
                            type={item.type}
                            onClick={() => {
                                this.handleBtnClick(item.code);
                            }}
                        >
                            {item.name}
                        </Button>
                    );
                }
            }
        });
    };
    componentDidMount() {
        Ajax({
            url: `/nccloud/platform/appregister/queryappmenus.do`,
            info: {
                name: "菜单注册",
                action: "菜单列表查询"
            },
            success: res => {
                let {
                    data: { appMenuVOs, isDevelopMode },
                    success
                } = res.data;
                if (success) {
                    this.setState({ listData: appMenuVOs, isDevelopMode });
                }
            }
        });
    }
    render() {
        let { listData, isedit } = this.state;
        this.columns = [
            {
                title: "序号",
                dataIndex: "num",
                key: "num"
            },
            {
                title: RenderTableTitle("菜单编码"),
                dataIndex: "menucode",
                key: "menucode",
                render: (text, record, index) => (
                    <EditableCell
                        type={"string"}
                        value={text}
                        editable={this.state.isedit}
                        cellIndex={index}
                        cellKey={"menucode"}
                        cellRequired={true}
                        cellChange={this.handleCellChange}
                        cellCheck={this.handleCellCheck}
                    />
                )
            },
            {
                title: RenderTableTitle("菜单名称"),
                dataIndex: "menuname",
                key: "menuname",
                render: (text, record, index) => (
                    <EditableCell
                        type={"string"}
                        value={text}
                        editable={this.state.isedit}
                        cellIndex={index}
                        cellKey={"menuname"}
                        cellRequired={true}
                        cellChange={this.handleCellChange}
                        cellCheck={this.handleCellCheck}
                    />
                )
            },
            {
                title: "菜单描述",
                dataIndex: "menudesc",
                key: "menudesc",
                render: (text, record, index) => (
                    <EditableCell
                        type={"string"}
                        value={text}
                        editable={this.state.isedit}
                        cellIndex={index}
                        cellKey={"menudesc"}
                        cellRequired={false}
                        cellChange={this.handleCellChange}
                    />
                )
            },
            {
                title: "是否启用",
                dataIndex: "isenable",
                key: "isenable",
                render: (text, record, index) => (
                    <Switch
                        disabled={this.state.isedit}
                        onChange={checked => {
                            this.handleChange(checked, record);
                        }}
                        checkedChildren={
                            <i className="iconfont icon-shenpitongguo" />
                        }
                        unCheckedChildren={
                            <i className="iconfont icon-shenpibohui" />
                        }
                        checked={text}
                    />
                )
            },
            {
                title: "是否系统内置",
                dataIndex: "isdefault",
                key: "isdefault",
                render: (text, record) => (
                    <Switch
                        disabled
                        checkedChildren={
                            <i className="iconfont icon-shenpitongguo" />
                        }
                        unCheckedChildren={
                            <i className="iconfont icon-shenpibohui" />
                        }
                        checked={text}
                    />
                )
            },
            {
                title: "创建人",
                dataIndex: "creatorRef",
                key: "creatorRef",
                render: (text, record) => {
                    if (text && text.refname) {
                        return <span>{text.refname}</span>;
                    } else {
                        return <span>{""}</span>;
                    }
                }
            },
            {
                title: "创建时间",
                dataIndex: "creationtime",
                key: "creationtime"
            },
            {
                title: "最后修改人",
                dataIndex: "modifierRef",
                key: "modifierRef",
                render: (text, record) => {
                    if (text && text.refname) {
                        return <span>{text.refname}</span>;
                    } else {
                        return <span>{""}</span>;
                    }
                }
            },
            {
                title: "最后修改时间",
                dataIndex: "modifiedtime",
                key: "modifiedtime"
            }
        ];
        if (!isedit) {
            let options = {
                title: "操作",
                key: "action",
                render: (text, record, index) => (
                    <div className="menugister-list-action">
                        <span
                            onClick={() => {
                                this.handleListClick("copy", record, index);
                            }}
                        >
                            复制
                        </span>
                        <Popconfirm
                            title="确定删除?"
                            cancelText={"取消"}
                            okText={"确定"}
                            onConfirm={() => {
                                this.handleListClick("del", record);
                            }}
                        >
                            <span>删除</span>
                        </Popconfirm>
                        {this.state.isedit ? (
                            ""
                        ) : (
                            <span
                                onClick={() => {
                                    this.handleListClick("menuitem", record);
                                }}
                            >
                                菜单项
                            </span>
                        )}
                    </div>
                )
            };
            this.columns.push(options);
        }
        return (
            <PageLayout className="nc-workbench-menuregister">
                <div className="menuregister-list">
                    <div className="menugister-list-title">
                        菜单注册
                        <div>{this.creatBtn()}</div>
                    </div>
                    <div className="menugister-list-table">
                        <Table
                            bordered
                            locale={{
                                emptyText: <CoverPosotion />
                            }}
                            pagination={false}
                            size="middle"
                            rowKey={"pk_menu"}
                            columns={this.columns}
                            dataSource={listData.map((item, index) => {
                                item.num = index + 1;
                                return item;
                            })}
                        />
                    </div>
                </div>
            </PageLayout>
        );
    }
}
MenuRegister.propTypes = {
    updateMenuItemData: PropTypes.func.isRequired
};
export default withRouter(
    connect(
        state => {
            return {};
        },
        { updateMenuItemData }
    )(MenuRegister)
);
