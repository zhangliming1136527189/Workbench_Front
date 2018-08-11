import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Tabs, Button, Table, Popconfirm } from "antd";
import _ from "lodash";
import { setAppParamData } from "Store/AppRegister/action";
import Ajax from "Pub/js/ajax";
import Notice from "Components/Notice";
import CoverPosotion from "Components/CoverPosition";
import EditableCell from "Components/EditableCell";
const TabPane = Tabs.TabPane;
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
/**
 * 应用页面 参数表格组件
 *
 */
class AppTable extends Component {
    constructor(props) {
        super(props);
        this.columnsPar = [
            {
                title: "序号",
                dataIndex: "num",
                width: "5%"
            },
            {
                title: RenderTableTitle("参数名称"),
                dataIndex: "paramname",
                width: "25%",
                render: (text, record, index) => (
                    <EditableCell
                        type={"string"}
                        value={text}
                        editable={record.editable}
                        cellIndex={index}
                        cellKey={"paramname"}
                        cellRequired={true}
                        cellChange={this.handleCellChange}
                        cellCheck={this.handleCellCheck}
                    />
                )
            },
            {
                title: RenderTableTitle("参数值"),
                width: "55%",
                dataIndex: "paramvalue",
                render: (text, record, index) => (
                    <EditableCell
                        type={"string"}
                        value={text}
                        editable={record.editable}
                        cellIndex={index}
                        cellKey={"paramvalue"}
                        cellRequired={true}
                        cellChange={this.handleCellChange}
                        cellCheck={this.handleCellCheck}
                    />
                )
            },
            {
                title: "操作",
                dataIndex: "operation",
                render: (text, record) => {
                    const { editable } = record;
                    return (
                        <div className="editable-row-operations">
                            {editable ? (
                                <span>
                                    <a
                                        className="margin-right-15"
                                        onClick={() => this.save(record)}
                                    >
                                        保存
                                    </a>
                                    <Popconfirm
                                        title="确定取消?"
                                        cancelText={"取消"}
                                        okText={"确定"}
                                        onConfirm={() => this.cancel(record)}
                                    >
                                        <a className="margin-right-5">取消</a>
                                    </Popconfirm>
                                </span>
                            ) : (
                                <span>
                                    <a
                                        className="margin-right-15"
                                        onClick={() => this.edit(record)}
                                    >
                                        编辑
                                    </a>
                                    <Popconfirm
                                        title="确定删除?"
                                        cancelText={"取消"}
                                        okText={"确定"}
                                        onConfirm={() => this.del(record)}
                                    >
                                        <a className="margin-right-15">删除</a>
                                    </Popconfirm>
                                </span>
                            )}
                        </div>
                    );
                }
            }
        ];
        this.cacheData;
    }
    /**
     * 表格编辑单元格
     * @param {String} key
     * @param {Number} index
     * @param {String} value
     */
    handleCellChange = (key, index, value) => {
        const listData = this.getNewData();
        listData[index][key] = value;
        this.props.setAppParamData(listData);
    };
    /**
     * 单元格编辑校验
     */
    handleCellCheck = (key, index, value) => {
        let newData = this.getNewData();
        if (!value && value.length === 0) {
            newData[index]["hasError"] = true;
            this.props.setAppParamData(newData);
            return {
                hasError: true
            };
        } else {
            newData[index]["hasError"] = false;
            this.props.setAppParamData(newData);
            return {
                hasError: false
            };
        }
    };
    edit(record) {
        let newData = this.getNewData();
        const dataList = newData.filter(item => item.editable === true);
        if (dataList.length > 0) {
            Notice({ status: "warning", msg: "请逐条修改按钮！" });
            return;
        }
        this.cacheData = _.cloneDeep(newData);
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            target.editable = true;
            this.props.setAppParamData(newData);
        }
    }
    del(record) {
        if (record.pk_param) {
            let newData = this.getNewData();
            Ajax({
                url: `/nccloud/platform/appregister/deleteparam.do`,
                data: {
                    pk_param: record.pk_param
                },
                info: {
                    name: "应用参数",
                    action: "删除"
                },
                success: ({ data: { data } }) => {
                    if (data) {
                        _.remove(
                            newData,
                            item => record.pk_param === item.pk_param
                        );
                        this.props.setAppParamData(newData);
                        this.cacheData = _.cloneDeep(newData);
                        Notice({ status: "success", msg: data.msg });
                    }
                }
            });
        }
    }
    save(record) {
        let newData = this.getNewData();
        if (record.hasError) {
            Notice({ status: "error", msg: "请检查必输项！" });
            return;
        }
        let url, listData, info;
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            if (target.pk_param) {
                url = `/nccloud/platform/appregister/editparam.do`;
                info = {
                    name: "应用参数",
                    action: "编辑"
                };
            } else {
                url = `/nccloud/platform/appregister/insertparam.do`;
                info = {
                    name: "应用参数",
                    action: "新增"
                };
            }
            listData = {
                ...target
            };
            Ajax({
                url: url,
                info: info,
                data: listData,
                success: ({ data: { data } }) => {
                    if (data) {
                        delete target.editable;
                        if (listData.pk_param) {
                            newData.map((item, index) => {
                                if (listData.pk_param === item.pk_param) {
                                    return { ...item, ...listData };
                                } else {
                                    return item;
                                }
                            });
                            this.props.setAppParamData(newData);
                        } else {
                            newData[newData.length - 1] = data;
                            this.props.setAppParamData(newData);
                        }
                        this.cacheData = _.cloneDeep(newData);
                        Notice({ status: "success", msg: data.msg });
                    }
                }
            });
        }
    }
    cancel(record) {
        let newData = this.getNewData();
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            delete target.editable;
            this.props.setAppParamData(this.cacheData);
        }
    }
    add() {
        if (this.props.isNew) {
            Notice({ status: "warning", msg: "请先将应用进行保存！" });
            return;
        }
        let newData = this.getNewData();
        const target = newData.filter(item => item.editable === true);
        if (target.length > 0) {
            Notice({ status: "warning", msg: "请逐条添加按钮！" });
            return;
        }
        this.cacheData = _.cloneDeep(newData);
        newData.push({
            editable: true,
            paramname: "",
            paramvalue: "",
            parentid: this.props.nodeInfo.id
        });
        this.props.setAppParamData(newData);
    }
    getNewData() {
        let appParamVOs = this.props.appParamVOs;
        return _.cloneDeep(appParamVOs);
    }
    /**
     * 创建按钮
     */
    creatAddLineBtn = () => {
        return (
            <div>
                <Button
                    onClick={() => this.add()}
                    style={{ marginLeft: "8px" }}
                >
                    增行
                </Button>
            </div>
        );
    };
    render() {
        let appParamVOs = this.props.appParamVOs;
        return (
            <Tabs activeKey="1" tabBarExtraContent={this.creatAddLineBtn()}>
                <TabPane tab="参数注册" key="1">
                    <Table
                        bordered
                        locale={{
                            emptyText: <CoverPosotion />
                        }}
                        pagination={false}
                        rowKey="num"
                        dataSource={appParamVOs.map((item, index) => {
                            item.num = index + 1;
                            return item;
                        })}
                        columns={this.columnsPar}
                        size="middle"
                    />
                </TabPane>
            </Tabs>
        );
    }
}
AppTable.propTypes = {
    isNew: PropTypes.bool.isRequired,
    nodeData: PropTypes.object.isRequired,
    nodeInfo: PropTypes.object.isRequired,
    appParamVOs: PropTypes.array.isRequired,
    setAppParamData: PropTypes.func.isRequired
};
export default connect(
    state => ({
        isNew: state.AppRegisterData.isNew,
        nodeInfo: state.AppRegisterData.nodeInfo,
        nodeData: state.AppRegisterData.nodeData,
        appParamVOs: state.AppRegisterData.appParamVOs
    }),
    { setAppParamData }
)(AppTable);
