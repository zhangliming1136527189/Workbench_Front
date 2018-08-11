import React, { Component } from "react";
import { Modal, Form } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
    setTreeData,
    setNodeInfo,
    setNodeData,
    setPageButtonData,
    setPageTemplateData,
    setAppParamData,
    setIsNew,
    setIsEdit,
    setExpandedKeys,
    setSelectedKeys,
    setOptype,
    setCopyNodeData,
    setMenuTreeData,
    setPageCopyData
} from "Store/AppManagement/action";
import Ajax from "Pub/js/ajax";
import SearchTree from "./SearchTree";
import ModuleFormCard from "./ModuleFormCard";
import ClassFormCard from "./ClassFormCard";
import AppFormCard from "./AppFormCard";
import PageFromCard from "./PageFromCard";
import {
    PageLayout,
    PageLayoutHeader,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
import ButtonCreate from "Components/ButtonCreate";
import AppCopy from "./AppCopy/index";
import PageCopy from "./PageCopy/index";
import Notice from "Components/Notice";
import "./index.less";
/**
 * 工作桌面 首页 页面
 * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染
 */

class AppManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            // '' 为空白 '0' 应用复制 '1' 页面复制
            modalType: "0"
        };
        this.historyOptype;
        this.historyNodeData;
    }
    /**
     * 按钮点击事件
     * @param {String} code
     */
    handleClick = code => {
        switch (code) {
            case "copy":
                this.setState(
                    {
                        visible: true,
                        modalType: "0"
                    },
                    this.reqMenuTreeData
                );
                break;
            case "pageCopy":
                let { parentcode } = this.props.nodeData;
                Ajax({
                    url: `/nccloud/platform/appregister/querytranstypelist.do`,
                    info: {
                        name: "应用管理",
                        action: "页面编码"
                    },
                    data: {
                        appCode: parentcode
                        // appCode: "1011DETAILUSER"
                    },
                    success: ({ data: { data } }) => {
                        if (data) {
                            data = data.map(item => {
                                item.value = item.code;
                                item.text = `${item.code}/${item.name}`;
                                return item;
                            });
                            this.setState(
                                {
                                    visible: true,
                                    modalType: "1",
                                    newPageOtions: data
                                },
                                this.pageCopy
                            );
                        }
                    }
                });
                break;
            case "active":
                this.appActive();
                break;
            default:
                break;
        }
    };
    // 请求菜单树数据
    reqMenuTreeData = () => {
        Ajax({
            url: `/nccloud/platform/appregister/menuitemregref.do`,
            info: {
                name: "应用复制",
                action: "菜单参照"
            },
            success: ({
                data: {
                    data: { rows }
                }
            }) => {
                if (rows.length > 0) {
                    this.props.setMenuTreeData(rows);
                    this.appCopy();
                }
            }
        });
    };
    // 页面复制
    pageCopy = () => {
        let { id } = this.props.nodeInfo;
        let pageCopyData = {
            pageId: id,
            newPageCode: "",
            newPageName: "",
            isCopyUserTemplet: false
        };
        this.props.setPageCopyData(pageCopyData);
    };
    // 应用复制
    appCopy = () => {
        let { code } = this.props.nodeInfo;
        let copyNodeData = {
            oldAppCode: code,
            newMenuItemCode: "",
            newAppName: "",
            newMenuItemName: "",
            isCopyUserTemplet: false
        };
        this.props.setCopyNodeData(copyNodeData);
    };
    // 应用停启用
    appActive = () => {
        let nodeData = this.props.nodeData;
        nodeData.isenable = !nodeData.isenable;
        Ajax({
            url: `/nccloud/platform/appregister/editapp.do`,
            info: {
                name: "应用管理",
                action: "停启用"
            },
            data: nodeData,
            success: ({ data: { data } }) => {
                if (data.msg) {
                    this.props.setNodeData(nodeData);
                    this.props.form.setFieldsValue({
                        isenable: nodeData.isenable
                    });
                }
            }
        });
    };
    /**
     * 右侧表单选择
     */
    switchFrom = () => {
        switch (this.props.optype) {
            // 对应树结构中的第一层
            case "1":
                return <ModuleFormCard form={this.props.form} />;
            // 对应树结构中的第二层;
            case "2":
                return <ModuleFormCard form={this.props.form} />;
            // 对应树结构的第三层
            case "3":
                return <ClassFormCard form={this.props.form} />;
            // 对应树结构的第四层
            case "4":
                return <AppFormCard form={this.props.form} />;
            // 对应树结构的第五层
            case "5":
                return <PageFromCard form={this.props.form} />;
            default:
                return "";
        }
    };
    /**
     * tree 数据请求
     */
    reqTreeData = () => {
        Ajax({
            url: `/nccloud/platform/appregister/querymodules.do`,
            info: {
                name: "应用注册模块",
                action: "查询"
            },
            success: ({ data }) => {
                if (data.success && data.data.length > 0) {
                    this.props.setTreeData(data.data);
                }
            }
        });
    };
    /**
     * 树节点详细信息请求
     * @param {Object} info 接口描述
     * @param {String} url 请求地址
     * @param {Object} data 请求数据
     * @param {Function} callback 成功回调
     */
    reqTreeNodeData = (info, url, data, callback) => {
        Ajax({
            url,
            data,
            info,
            success: ({ data: { data } }) => {
                if (data) {
                    callback(data);
                }
            }
        });
    };
    /**
     * 数据点选择事件
     * @param {Object} obj 选中的数节点对象
     */
    handleTreeNodeSelect = obj => {
        let optype = "";
        let id;
        let nodeInfo = {
            id: "",
            code: "",
            name: "",
            parentId: "",
            iscopypage: false
        };
        if (obj) {
            switch (obj.flag) {
                // 对应树的第一层
                case "0":
                    id = obj.moduleid;
                    let appFieldCallBack = data => {
                        this.props.setNodeData(data);
                    };
                    this.reqTreeNodeData(
                        { name: "应用注册", action: "应用查询" },
                        `/nccloud/platform/appregister/querymodule.do`,
                        { moduleid: id },
                        appFieldCallBack
                    );
                    optype = "1";
                    break;
                // 对应树的第二层
                case "1":
                    id = obj.moduleid;
                    let appModuleCallBack = data => {
                        this.props.setNodeData(data);
                    };
                    this.reqTreeNodeData(
                        { name: "应用注册", action: "应用查询" },
                        `/nccloud/platform/appregister/querymodule.do`,
                        { moduleid: id },
                        appModuleCallBack
                    );
                    optype = "2";
                    break;
                // 对应树的第三层
                case "2":
                    let appClassCallBack = data => {
                        this.props.setNodeData(data.appRegisterVO);
                        this.props.setAppParamData(data.appParamVOs);
                    };
                    this.reqTreeNodeData(
                        { name: "应用注册", action: "应用查询" },
                        `/nccloud/platform/appregister/queryapp.do`,
                        { pk_appregister: obj.moduleid },
                        appClassCallBack
                    );
                    id = obj.moduleid;
                    optype = "3";
                    break;
                // 对应树的第四层
                case "3":
                    let appCallBack = data => {
                        this.props.setNodeData(data.appRegisterVO);
                        this.props.setAppParamData(data.appParamVOs);
                        this.props.form.resetFields();
                    };
                    this.reqTreeNodeData(
                        { name: "应用注册", action: "应用查询" },
                        `/nccloud/platform/appregister/queryapp.do`,
                        { pk_appregister: obj.def1 },
                        appCallBack
                    );
                    id = obj.def1;
                    optype = "4";
                    break;
                // 对应树的第五层
                case "4":
                    let pageCallBack = data => {
                        let iscopypage = data.iscopypage;
                        let { parent_id } = data.apppageVO;
                        nodeInfo = {
                            ...this.props.nodeInfo,
                            parentId: parent_id,
                            iscopypage
                        };
                        this.props.setNodeInfo(nodeInfo);
                        this.props.setNodeData(data.apppageVO);
                        this.props.setPageButtonData(
                            data.appButtonVOs ? data.appButtonVOs : []
                        );
                        this.props.setPageTemplateData(
                            data.pageTemplets ? data.pageTemplets : []
                        );
                    };
                    this.reqTreeNodeData(
                        { name: "应用注册", action: "应用页面查询" },
                        `/nccloud/platform/appregister/querypagedetail.do`,
                        { pk_apppage: obj.moduleid },
                        pageCallBack
                    );
                    id = obj.moduleid;
                    optype = "5";
                    break;
                default:
                    break;
            }
            if (obj.moduleid !== "00") {
                nodeInfo = {
                    id,
                    code: obj.systypecode,
                    name: obj.name,
                    parentId: obj.parentcode,
                    iscopypage: false
                };
            }
        }
        this.props.setIsNew(false);
        this.props.setIsEdit(false);
        this.props.setNodeInfo(nodeInfo);
        this.props.setOptype(optype);
    };
    /**
     * 树查询
     */
    handleTreeSearch = value => {
        let searchCallback = data => {
            if (value.length > 0) {
                let expandedKeys = data.map(item => item.moduleid);
                this.props.setExpandedKeys(expandedKeys);
            } else {
                this.props.setExpandedKeys(["00"]);
            }
            this.props.setTreeData(data);
        };
        this.reqTreeNodeData(
            { name: "应用注册", action: "应用查询" },
            `/nccloud/platform/appregister/searchapps.do`,
            { search_content: value },
            searchCallback
        );
    };
    /**
     * 应用复制确认事件
     */
    handleOk = modalType => {
        this.props.form.validateFields(errors => {
            if (!errors) {
                let copyNodeData = this.props.form.getFieldsValue();
                console.log(copyNodeData);
                if (modalType === "0") {
                    let {
                        oldAppCode,
                        newMenuItemCode,
                        newAppName,
                        newMenuItemName,
                        isCopyUserTemplet
                    } = copyNodeData;
                    Ajax({
                        url: `/nccloud/platform/appregister/copyapp.do`,
                        data: {
                            oldAppCode,
                            newMenuItemCode,
                            newAppName,
                            newMenuItemName,
                            isCopyUserTemplet
                        },
                        info: {
                            name: "应用管理",
                            action: "应用复制"
                        },
                        success: ({ data: { data } }) => {
                            this.setState({
                                visible: false
                            });
                            this.reqTreeData();
                            Notice({ status: "success", msg: data.msg });
                        }
                    });
                } else {
                    let {
                        newPageCode,
                        newPageName,
                        isCopyUserTemplet
                    } = copyNodeData;
                    let pageCopyData = {
                        newPageCode,
                        newPageName,
                        isCopyUserTemplet
                    };
                    pageCopyData = {
                        ...this.props.pageCopyData,
                        ...pageCopyData
                    };
                    Ajax({
                        url: `/nccloud/platform/appregister/copyapppage.do`,
                        info: {
                            name: "应用管理",
                            action: "页面复制"
                        },
                        data: pageCopyData,
                        success: ({ data: { data } }) => {
                            if (data) {
                                this.setState({
                                    visible: false
                                });
                                this.reqTreeData();
                                Notice({ status: "success", msg: data.msg });
                            }
                        }
                    });
                }
            }
        });
    };
    handleCancel = modalType => {
        this.props.form.resetFields();
        this.setState({
            visible: false
        });
    };
    componentDidMount() {
        let {
            selectedKeys,
            setSelectedKeys,
            optype,
            setOptype,
            treeData,
            nodeInfo
        } = this.props;
        if (optype !== "") {
            setSelectedKeys(selectedKeys);
            setOptype(optype);
            let historyNode = treeData.find(
                item => item.moduleid === nodeInfo.id
            );
            this.handleTreeNodeSelect(historyNode);
        } else {
            setSelectedKeys(["00"]);
            setOptype("");
        }
        this.reqTreeData();
    }
    render() {
        let optype = this.props.optype;
        let modalType = this.state.modalType;
        let isenable = this.props.nodeData.isenable
            ? this.props.nodeData.isenable
            : false;
        let iscopypage = this.props.nodeInfo.iscopypage
            ? this.props.nodeInfo.iscopypage
            : false;
        let btnList = [
            {
                code: "copy",
                name: "应用复制",
                type: "primary",
                isshow: optype === "4"
            },
            {
                code: "pageCopy",
                name: "页面复制",
                type: "primary",
                isshow: optype === "5" && iscopypage
            },
            {
                code: "active",
                name: isenable ? "停用" : "启用",
                type: "primary",
                isshow: optype === "4"
            }
        ];
        return (
            <PageLayout
                className="nc-workbench-appRegister"
                header={
                    <PageLayoutHeader>
                        <div>应用管理</div>
                        <ButtonCreate
                            dataSource={btnList}
                            onClick={this.handleClick}
                        />
                    </PageLayoutHeader>
                }
            >
                <PageLayoutLeft>
                    <SearchTree
                        className="appRegister-searchTree"
                        onSelect={this.handleTreeNodeSelect}
                        onSearch={this.handleTreeSearch}
                    />
                </PageLayoutLeft>
                <PageLayoutRight>
                    {this.switchFrom()}
                    <Modal
                        maskClosable={false}
                        closable={false}
                        title={modalType === "0" ? "应用复制" : "页面复制"}
                        okText={"确定"}
                        cancelText={"取消"}
                        width={modalType === "0" ? 800 : 400}
                        wrapClassName="vertical-center-modal"
                        visible={this.state.visible}
                        onOk={() => {
                            this.handleOk(modalType);
                        }}
                        onCancel={() => {
                            this.handleCancel(modalType);
                        }}
                    >
                        {modalType === "0" ? (
                            <AppCopy form={this.props.form} />
                        ) : (
                            <PageCopy
                                form={this.props.form}
                                newPageOtions={this.state.newPageOtions}
                            />
                        )}
                    </Modal>
                </PageLayoutRight>
            </PageLayout>
        );
    }
}
AppManagement.propTypes = {
    isNew: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool.isRequired,
    nodeInfo: PropTypes.object.isRequired,
    nodeData: PropTypes.object.isRequired,
    treeData: PropTypes.array.isRequired,
    setTreeData: PropTypes.func.isRequired,
    setNodeData: PropTypes.func.isRequired,
    setPageButtonData: PropTypes.func.isRequired,
    setPageTemplateData: PropTypes.func.isRequired,
    setAppParamData: PropTypes.func.isRequired,
    setIsNew: PropTypes.func.isRequired,
    setIsEdit: PropTypes.func.isRequired,
    setExpandedKeys: PropTypes.func.isRequired,
    setSelectedKeys: PropTypes.func.isRequired,
    optype: PropTypes.string.isRequired,
    setOptype: PropTypes.func.isRequired,
    selectedKeys: PropTypes.array.isRequired,
    setCopyNodeData: PropTypes.func.isRequired,
    setMenuTreeData: PropTypes.func.isRequired,
    copyNodeData: PropTypes.object.isRequired,
    setPageCopyData: PropTypes.func.isRequired,
    pageCopyData: PropTypes.object.isRequired
};
AppManagement = Form.create()(AppManagement);
export default connect(
    state => ({
        nodeData: state.AppManagementData.nodeData,
        nodeInfo: state.AppManagementData.nodeInfo,
        treeData: state.AppManagementData.treeData,
        isNew: state.AppManagementData.isNew,
        isEdit: state.AppManagementData.isEdit,
        selectedKeys: state.AppManagementData.selectedKeys,
        optype: state.AppManagementData.optype,
        copyNodeData: state.AppManagementData.copyNodeData,
        pageCopyData: state.AppManagementData.pageCopyData
    }),
    {
        setTreeData,
        setNodeData,
        setNodeInfo,
        setPageButtonData,
        setPageTemplateData,
        setAppParamData,
        setIsNew,
        setIsEdit,
        setExpandedKeys,
        setSelectedKeys,
        setOptype,
        setCopyNodeData,
        setMenuTreeData,
        setPageCopyData
    }
)(AppManagement);
