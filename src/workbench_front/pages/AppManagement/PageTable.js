import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Tabs, Table, Select } from "antd";
import _ from "lodash";
import {
    setPageButtonData,
    setPageTemplateData,
    setPageActiveKey
} from "Store/AppManagement/action";
import EditableCell from "Components/EditableCell";
import CoverPosotion from "Components/CoverPosition";
import Ajax from "Pub/js/ajax";
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const EditableSelectCell = ({ editable, value, onChange }) => (
    <div>
        {editable ? (
            <Select
                value={value}
                style={{ width: 120 }}
                onChange={selected => onChange(selected)}
            >
                <Option value="button_main">主要按钮</Option>
                <Option value="button_secondary">次要按钮</Option>
                <Option value="buttongroup">按钮组</Option>
                <Option value="dropdown">下拉按钮</Option>
                <Option value="divider">分割下拉按钮</Option>
                <Option value="more">更多按钮</Option>
            </Select>
        ) : (
            switchType(value)
        )}
    </div>
);
/**
 * 按钮类型选择
 * @param {String} value
 */
const switchType = value => {
    switch (value) {
        case "button_main":
            return "主要按钮";
        case "button_secondary":
            return "次要按钮";
        case "buttongroup":
            return "按钮组";
        case "dropdown":
            return "下拉按钮";
        case "divider":
            return "分割下拉按钮";
        case "more":
            return "更多按钮";
        default:
            break;
    }
};
class PageTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iserror: false
        };
        this.columnsBtn = [
            {
                title: "序号",
                dataIndex: "btnorder",
                width: "5%",
                render: text => text + 1
            },
            {
                title: "按钮编码",
                dataIndex: "btncode",
                width: "10%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btncode")
            },
            {
                title: "按钮名称",
                dataIndex: "btnname",
                width: "10%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btnname")
            },
            {
                title: "按钮类型",
                dataIndex: "btntype",
                width: "15%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btntype", "select")
            },
            {
                title: "父按钮编码",
                dataIndex: "parent_code",
                width: "10%",
                render: (text, record) =>
                    this.renderColumns(text, record, "parent_code")
            },
            {
                title: "按钮区域",
                dataIndex: "btnarea",
                width: "10%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btnarea")
            },
            {
                title: "按钮功能描述",
                dataIndex: "btndesc",
                width: "25%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btndesc")
            },
            {
                title: "操作",
                dataIndex: "operation",
                render: (text, record) => {
                    const { isenable } = record;
                    return (
                        <div className="editable-row-operations">
                            <a
                                className="margin-right-5"
                                onClick={() => this.btnActive(record)}
                            >
                                {isenable ? "停用" : "启用"}
                            </a>
                        </div>
                    );
                }
            }
        ];
        this.columnsSt = [
            {
                title: "序号",
                dataIndex: "num",
                width: "5%"
            },
            {
                title: "模板编码",
                dataIndex: "code",
                width: "25%",
                render: (text, record) =>
                    this.renderColumns(text, record, "code")
            },
            {
                title: "模板名称",
                dataIndex: "name",
                width: "15%",
                render: (text, record) =>
                    this.renderColumns(text, record, "name")
            },
            {
                title: "多语字段",
                dataIndex: "resid",
                width: "15%",
                render: (text, record) =>
                    this.renderColumns(text, record, "resid")
            }
        ];
        this.cacheData;
    }
    // 按钮起停用
    btnActive = record => {
        record.isenable = !record.isenable;
        Ajax({
            url: `/nccloud/platform/appregister/editbutton.do`,
            info: {
                name: "应用管理",
                action: "按钮启停用"
            },
            data: record,
            success: ({ data: { data } }) => {
                if (data.msg) {
                    let { appButtonVOs, setPageButtonData } = this.props;
                    appButtonVOs = appButtonVOs.map(item => {
                        if (item.pk_btn === record.pk_btn) {
                            item = record;
                        }
                        return item;
                    });
                    setPageButtonData(appButtonVOs);
                }
            }
        });
    };
    renderColumns(text, record, column, type = "input") {
        record = _.cloneDeep(record);
        if (type === "input") {
            if (record.editable) {
                return (
                    <EditableCell
                        value={text}
                        hasError={this.state.iserror}
                        onChange={this.onCellChange(record, column)}
                        onCheck={this.onCellCheck(record, column)}
                    />
                );
            } else {
                return <div>{text}</div>;
            }
        } else if (type === "select") {
            return (
                <EditableSelectCell
                    editable={record.editable}
                    value={text}
                    onChange={value => this.handleChange(value, record, column)}
                />
            );
        }
    }
    /**
     * 单元格编辑校验
     */
    onCellCheck = (record, dataIndex) => {
        return value => {
            const listData = this.getNewData();
            const target = listData.find(
                item =>
                    (item.num !== record.num && item[dataIndex] === value) ||
                    value.length === 0
            );
            if (target) {
                this.setState({ iserror: true });
                return true;
            } else {
                this.setState({ iserror: false });
                return false;
            }
        };
    };
    /**
     * 单元格编辑方法
     */
    onCellChange = (record, column) => {
        return value => {
            let newData = this.getNewData();
            const target = newData.filter(item => record.num === item.num)[0];
            if (target) {
                target[column] = value;
                this.setNewData(newData);
            }
        };
    };
    handleChange(value, record, column) {
        let newData = this.getNewData();
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            target[column] = value;
            this.setNewData(newData);
        }
    }
    getNewData() {
        let activeKey = this.props.pageActiveKey;
        let { appButtonVOs, pageTemplets } = this.props;
        if (activeKey === "1") {
            return _.cloneDeep(appButtonVOs);
        } else if (activeKey === "2") {
            return _.cloneDeep(pageTemplets);
        }
    }
    setNewData(newData) {
        let activeKey = this.props.pageActiveKey;
        if (activeKey === "1") {
            this.props.setPageButtonData(newData);
        } else if (activeKey === "2") {
            this.props.setPageTemplateData(newData);
        }
    }
    render() {
        let { appButtonVOs = [], pageTemplets = [] } = this.props;
        return (
            <div>
                <Tabs
                    onChange={activeKey => {
                        this.props.setPageActiveKey(activeKey);
                    }}
                    activeKey={this.props.pageActiveKey}
                >
                    <TabPane tab="按钮注册" key="1">
                        <Table
                            bordered
                            locale={{
                                emptyText: <CoverPosotion />
                            }}
                            pagination={false}
                            rowKey="btnorder"
                            dataSource={appButtonVOs.map((item, index) => {
                                item.num = item.btnorder;
                                return item;
                            })}
                            columns={this.columnsBtn}
                            size="middle"
                        />
                    </TabPane>
                    <TabPane tab="页面模板注册" key="2">
                        <Table
                            bordered
                            locale={{
                                emptyText: <CoverPosotion />
                            }}
                            pagination={false}
                            rowKey="num"
                            dataSource={pageTemplets.map((item, index) => {
                                item.num = index + 1;
                                return item;
                            })}
                            columns={this.columnsSt}
                            size="middle"
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
PageTable.propTypes = {
    isNew: PropTypes.bool.isRequired,
    nodeInfo: PropTypes.object.isRequired,
    nodeData: PropTypes.object.isRequired,
    appButtonVOs: PropTypes.array.isRequired,
    pageTemplets: PropTypes.array.isRequired,
    setPageTemplateData: PropTypes.func.isRequired,
    setPageButtonData: PropTypes.func.isRequired,
    setPageActiveKey: PropTypes.func.isRequired
};
export default connect(
    state => {
        return {
            isNew: state.AppManagementData.isNew,
            nodeData: state.AppManagementData.nodeData,
            nodeInfo: state.AppManagementData.nodeInfo,
            pageTemplets: state.AppManagementData.pageTemplets,
            appButtonVOs: state.AppManagementData.appButtonVOs,
            pageActiveKey: state.AppManagementData.pageActiveKey
        };
    },
    { setPageButtonData, setPageTemplateData, setPageActiveKey }
)(withRouter(PageTable));
