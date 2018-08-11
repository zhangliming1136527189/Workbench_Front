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
    setOptype
} from "Store/AppRegister/action";
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
import Notice from "Components/Notice";
import "./index.less";
Modal.mask = false;
const confirm = Modal.confirm;
/**
 * 工作桌面 首页 页面
 * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染
 */

class AppRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.historyOptype;
        this.historyNodeData;
    }
    /**
     * 按钮点击事件
     * @param {String} code
     */
    handleClick = code => {
        switch (code) {
            case "addModule":
                this.addModule();
                break;
            case "addAppClass":
                this.addAppClass();
                break;
            case "addApp":
                this.addApp();
                break;
            case "addPage":
                this.addPage();
                break;
            case "save":
                this.props.form.validateFields(
                    // { first: true, force: true },
                    (errors, values) => {
                        if (!errors) {
                            this.save();
                        }
                    }
                );
                break;
            case "cancel":
                this.props.setNodeData(this.historyNodeData);
                this.props.form.resetFields();
                this.props.setIsNew(false);
                this.props.setIsEdit(false);
                this.props.setOptype(this.historyOptype);
                break;
            case "del":
                this.del();
                break;
            case "edit":
                this.historyNodeData = this.props.nodeData;
                this.historyOptype = this.props.optype;
                this.props.setIsNew(false);
                this.props.setIsEdit(true);
                break;
            default:
                break;
        }
    };
    /**
     * 添加模块
     */
    addModule = () => {
        let optype = this.props.optype;
        this.historyOptype = optype;
        if (optype === "") {
            optype = "1";
        } else if (optype === "1") {
            optype = "2";
        }
        let moduleData = {
            systypecode: "",
            moduleid: "",
            systypename: "",
            orgtypecode: "",
            appscope: "",
            isaccount: false,
            supportcloseaccbook: false,
            resid: "",
            devmodule: ""
        };
        this.historyNodeData = this.props.nodeData;
        this.props.setNodeData(moduleData);
        this.props.setIsNew(true);
        this.props.setIsEdit(true);
        this.props.setOptype(optype);
    };
    /**
     * 添加应用分类
     */
    addAppClass = () => {
        let optype = this.props.optype;
        this.historyOptype = optype;
        if (optype === "2") {
            optype = "3";
        }
        this.historyNodeData = this.props.nodeData;
        let classData = {
            apptype: 0,
            isenable: true,
            code: "",
            name: "",
            app_desc: "",
            resid: "",
            help_name: ""
        };
        this.props.setNodeData(classData);
        this.props.setIsNew(true);
        this.props.setIsEdit(true);
        this.props.setOptype(optype);
    };
    /**
     * 添加页面
     */
    addApp = () => {
        let optype = this.props.optype;
        this.historyOptype = optype;
        if (optype === "3") {
            optype = "4";
        }
        this.historyNodeData = this.props.nodeData;
        this.props.form.resetFields();
        let appData = {
            code: "",
            name: "",
            orgtypecode: "",
            funtype: "",
            app_desc: "",
            help_name: "",
            isenable: true,
            iscauserusable: false,
            uselicense_load: true,
            iscopypage: false,
            pk_group: "",
            mdidRef: { refpk: "", refname: "", refcode: "" },
            width: "1",
            height: "1",
            target_path: "",
            apptype: "1",
            fun_property: "0",
            resid: "",
            image_src: ""
        };
        this.props.setAppParamData([]);
        this.props.setNodeData(appData);
        this.props.setIsNew(true);
        this.props.setIsEdit(true);
        this.props.setOptype(optype);
    };
    /**
     * 添加页面
     */
    addPage = () => {
        let optype = this.props.optype;
        this.historyOptype = optype;
        if (optype === "4") {
            optype = "5";
        }
        this.historyNodeData = this.props.nodeData;
        let pageData = {
            pagecode: "",
            pagename: "",
            pagedesc: "",
            pageurl: "",
            resid: "",
            isdefault: false
        };
        this.props.setPageButtonData([]);
        this.props.setPageTemplateData([]);
        this.props.setNodeData(pageData);
        this.props.setIsNew(true);
        this.props.setIsEdit(true);
        this.props.setOptype(optype);
    };
    /**
     * 保存
     */
    save = () => {
        let fromData = this.props.form.getFieldsValue();
        if (this.props.nodeData.children) {
            delete this.props.nodeData.children;
        }
        fromData = { ...this.props.nodeData, ...fromData };
        let { id, code } = this.props.nodeInfo;
        let optype = this.props.optype;
        //  新增保存回调
        let newSaveFun = data => {
            let selectedKeys = this.props.selectedKeys;
            let id, code, name, parentId;
            if (optype === "1" || optype === "2") {
                if (data.parentcode) {
                    selectedKeys.push(data.parentcode);
                }
                id = data.moduleid;
                code = data.systypecode;
                name = data.systypename;
                parentId = data.parentcode;
                this.props.setExpandedKeys(selectedKeys);
                this.props.setSelectedKeys([data.moduleid]);
            }
            if (optype === "3") {
                id = data.pk_appregister;
                code = data.code;
                name = data.name;
                parentId = data.parent_id;
                selectedKeys.push(data.parent_id);
                this.props.setExpandedKeys(selectedKeys);
                this.props.setSelectedKeys([data.pk_appregister]);
            }
            if (optype === "4") {
                id = data.pk_appregister;
                code = data.code;
                name = data.name;
                parentId = data.parent_id;
                selectedKeys.push(data.parent_id);
                this.props.setExpandedKeys(selectedKeys);
                this.props.setSelectedKeys([data.code]);
            }
            if (optype === "5") {
                id = data.pk_apppage;
                code = data.pagecode;
                name = data.pagename;
                parentId = data.parent_id;
                selectedKeys.push(data.parentcode);
                this.props.setExpandedKeys(selectedKeys);
                this.props.setSelectedKeys([data.pk_apppage]);
            }
            this.reqTreeData();
            this.props.setNodeInfo({
                id,
                code,
                name,
                parentId,
                isleaf: true
            });
            this.props.setNodeData(data);
            this.props.setIsNew(false);
            this.props.setIsEdit(false);
            Notice({ status: "success" });
        };
        //  对应树节点前两层 模块编辑保存成功回调
        let moduleEditFun = data => {
            this.reqTreeData();
            Notice({ status: "success", msg: data.msg });
            this.props.setIsNew(false);
            this.props.setIsEdit(false);
        };
        //  对应树节点中间两层 应用分类 及 应用编辑后保存
        let appEditFun = data => {
            let treeData = {
                moduleid: data.pk_appregister,
                parentcode: code,
                systypecode: data.code,
                systypename: data.name,
                flag: "1"
            };
            this.updateTreeData(treeData);
            Notice({ status: "success" });
            this.props.setIsNew(false);
            this.props.setIsEdit(false);
        };
        //  对应树节点中间两层 应用分类 及 应用编辑后保存
        let pageEditFun = data => {
            let treeData = {
                moduleid: data.pk_apppage,
                parentcode: data.code,
                systypecode: data.pagecode,
                systypename: data.pagename,
                flag: "2"
            };
            this.updateTreeData(treeData);
            Notice({ status: "success" });
            this.props.setIsNew(false);
            this.props.setIsEdit(false);
        };
        if (this.props.isNew) {
            if (optype === "1" || optype === "2") {
                if (id !== "00" && id.length > 0) {
                    fromData.parentcode = id;
                }
                this.reqTreeNodeData(
                    {
                        name: "应用注册",
                        action: "模块新增"
                    },
                    `/nccloud/platform/appregister/insertmodule.do`,
                    fromData,
                    newSaveFun
                );
            }
            if (optype === "3" || optype === "4") {
                if (id.length > 0) {
                    fromData.parent_id = id;
                }
                // 将元数据id参照的refpk 赋给 mdid 字段
                if (fromData.hasOwnProperty("mdid")) {
                    fromData.mdid = fromData.mdidRef.refpk;
                }
                this.reqTreeNodeData(
                    {
                        name: "应用注册",
                        action: "应用新增"
                    },
                    `/nccloud/platform/appregister/insertapp.do`,
                    fromData,
                    newSaveFun
                );
            }
            if (optype === "5") {
                if (id.length > 0) {
                    fromData.parent_id = id;
                    fromData.parentcode = code;
                }
                this.reqTreeNodeData(
                    {
                        name: "应用注册",
                        action: "页面新增"
                    },
                    `/nccloud/platform/appregister/insertpage.do`,
                    fromData,
                    newSaveFun
                );
            }
        } else {
            if (optype === "1" || optype === "2") {
                this.reqTreeNodeData(
                    {
                        name: "应用注册",
                        action: "模块编辑"
                    },
                    `/nccloud/platform/appregister/editmodule.do`,
                    fromData,
                    moduleEditFun
                );
            }
            if (optype === "3" || optype === "4") {
                // 将元数据id参照的refpk 赋给 mdid 字段
                if (fromData.hasOwnProperty("mdid")) {
                    fromData.mdid = fromData.mdidRef.refpk;
                }
                this.reqTreeNodeData(
                    {
                        name: "应用注册",
                        action: "应用编辑"
                    },
                    `/nccloud/platform/appregister/editapp.do`,
                    fromData,
                    appEditFun
                );
            }
            if (optype === "5") {
                this.reqTreeNodeData(
                    {
                        name: "应用注册",
                        action: "页面编辑"
                    },
                    `/nccloud/platform/appregister/editpage.do`,
                    fromData,
                    pageEditFun
                );
            }
        }
    };
    /**
     * 删除
     */
    del = () => {
        if (!this.props.nodeInfo.isleaf) {
            Notice({
                status: "warning",
                msg: "请先删除当前节点下的内容！"
            });
            return;
        }
        confirm({
            closable: false,
            title: "是否要删除?",
            content: "",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            mask: false,
            onOk: () => {
                let optype = this.props.optype;
                let { id } = this.props.nodeInfo;
                let delFun = data => {
                    Notice({
                        status: "success",
                        msg: data.true
                    });
                    this.reqTreeData();
                    this.props.setNodeData({});
                    this.props.setSelectedKeys(["00"]);
                    this.props.setOptype("");
                };
                if (optype === "1" || optype === "2") {
                    this.reqTreeNodeData(
                        {
                            name: "应用注册",
                            action: "模块删除"
                        },
                        `/nccloud/platform/appregister/deletemodule.do`,
                        {
                            moduleid: id
                        },
                        delFun
                    );
                }
                if (optype === "3" || optype === "4") {
                    this.reqTreeNodeData(
                        {
                            name: "应用注册",
                            action: "应用删除"
                        },
                        `/nccloud/platform/appregister/deleteapp.do`,
                        {
                            pk_appregister: id
                        },
                        delFun
                    );
                }
                if (optype === "5") {
                    this.reqTreeNodeData(
                        {
                            name: "应用注册",
                            action: "页面删除"
                        },
                        `/nccloud/platform/appregister/deletepage.do`,
                        {
                            pk_apppage: id
                        },
                        delFun
                    );
                }
            },
            onCancel() {
                console.log("Cancel");
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
    handleTreeNodeSelect = (obj, selectedKey) => {
        if (this.treeNodeChange()) {
            return;
        }
        let optype = "";
        let id;
        let nodeInfo = {
            id: "",
            code: "",
            name: "",
            parentId: "",
            isleaf: false
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
                        let { parent_id } = data.apppageVO;
                        this.props.setNodeInfo({
                            ...this.props.nodeInfo,
                            parentId: parent_id
                        });
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
                    isleaf:
                        (obj.children && obj.children.length === 0) ||
                        obj.isleaf
                };
            }
        }
        this.props.setIsNew(false);
        this.props.setIsEdit(false);
        this.props.setNodeInfo(nodeInfo);
        this.props.setOptype(optype);
        this.props.setSelectedKeys(selectedKey);
    };
    /**
     * 更新树数组
     * @param {Object} obj  需要更新的树节点
     */
    updateTreeData = obj => {
        let treeDataArray = this.props.treeData;
        treeDataArray = treeDataArray.map(item => {
            if (item.moduleid === obj.moduleid) {
                item = obj;
            }
            return item;
        });
        this.props.setTreeData(treeDataArray);
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
     * 树节点切换校验
     *
     */
    treeNodeChange = () => {
        let flag = true;
        if (this.props.isEdit) {
            confirm({
                closable: false,
                title: "是否保存数据?",
                content: "",
                okText: "确定",
                okType: "danger",
                cancelText: "取消",
                mask: false,
                onOk: () => {
                    this.handleClick("save");
                    flag = false;
                },
                onCancel() {}
            });
        } else {
            flag = false;
        }
        return flag;
    };
    componentDidMount() {
        this.reqTreeData();
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
            this.handleTreeNodeSelect(historyNode,selectedKeys);
        } else {
            setSelectedKeys(["00"]);
            setOptype("");
        }
    }
    render() {
        let optype = this.props.optype;
        let isEdit = this.props.isEdit;
        let nodeData = this.props.nodeData;
        let btnList = [
            {
                code: "addModule",
                name: "增加模块",
                type: "primary",
                isshow: !isEdit && (optype === "" || optype === "1")
            },
            {
                code: "addAppClass",
                name: "增加应用分类",
                type: "primary",
                isshow: !isEdit && optype === "2"
            },
            {
                code: "addApp",
                name: "增加应用",
                type: "primary",
                isshow: !isEdit && optype === "3"
            },
            {
                code: "addPage",
                name: "增加页面",
                type: "primary",
                isshow:
                    !isEdit &&
                    optype === "4" &&
                    nodeData &&
                    nodeData.apptype === "1"
            },
            {
                code: "save",
                name: "保存",
                type: "primary",
                isshow: isEdit
            },
            {
                code: "cancel",
                name: "取消",
                type: "",
                isshow: isEdit
            },
            {
                code: "del",
                name: "删除",
                type: "",
                isshow: !isEdit && optype !== ""
            },
            {
                code: "edit",
                name: "修改",
                type: "primary",
                isshow: !isEdit && optype !== ""
            }
        ];
        return (
            <PageLayout
                className="nc-workbench-appRegister"
                header={
                    <PageLayoutHeader>
                        <div>应用注册</div>
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
                <PageLayoutRight>{this.switchFrom()}</PageLayoutRight>
            </PageLayout>
        );
    }
}
AppRegister.propTypes = {
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
    selectedKeys: PropTypes.array.isRequired
};
AppRegister = Form.create()(AppRegister);
export default connect(
    state => ({
        nodeData: state.AppRegisterData.nodeData,
        nodeInfo: state.AppRegisterData.nodeInfo,
        treeData: state.AppRegisterData.treeData,
        isNew: state.AppRegisterData.isNew,
        isEdit: state.AppRegisterData.isEdit,
        selectedKeys: state.AppRegisterData.selectedKeys,
        optype: state.AppRegisterData.optype
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
        setOptype
    }
)(AppRegister);
