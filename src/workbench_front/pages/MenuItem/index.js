import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";
import { Modal, Form } from "antd";
import {
    PageLayout,
    PageLayoutHeader,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
import { FormContent, dataDefaults } from "Components/FormCreate";
import Ajax from "Pub/js/ajax.js";
import { GetQuery, Pad } from "Pub/js/utils.js";
import TreeSearch from "./TreeSearch";
import ButtonCreate from "Components/ButtonCreate";
import Notice from "Components/Notice";
import "./index.less";
const confirm = Modal.confirm;
class MenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            mt: "",
            mn: "",
            parentKey: "",
            isedit: false,
            isNew: false,
            expandedKeys: ["00"],
            selectedKeys: ["00"],
            treeData: [],
            fields: {},
            formData: {
                menuitemcode: "",
                menuitemname: "",
                menudes: "",
                appcodeRef: {},
                resid: ""
            }
        };
        this.newFormData = {
            menuitemcode: "",
            menuitemname: "",
            menudes: "",
            appcodeRef: {},
            resid: ""
        };
        this.historyData;
    }
    /**
     * 按钮点击事件
     */
    handleBtnClick = key => {
        switch (key) {
            case "add":
                this.add();
                break;
            case "edit":
                let formData = this.props.form.getFieldsValue();
                this.historyData = { ...this.state.fields, ...formData };
                this.setState({
                    isedit: true,
                    formData,
                    fields: this.historyData
                });
                break;
            case "save":
                this.save();
                break;
            case "cancle":
                this.props.form.resetFields();
                this.setState({
                    isedit: false,
                    isNew: false,
                    fields: { ...this.historyData },
                    formData: {
                        menuitemcode: this.historyData.menuitemcode,
                        menuitemname: this.historyData.menuitemname,
                        appcodeRef: this.historyData.appcodeRef,
                        menudes: this.historyData.menudes,
                        resid: this.historyData.resid
                    }
                });
                break;
            case "del":
                this.del();
                break;
            default:
                break;
        }
    };
    /**
     * 新增事件
     */
    add = () => {
        let fields = this.state.fields;
        let newCode;
        if (this.state.parentKey === "" || this.state.parentKey === "00") {
            let treeArrayData = this.state.treeData.filter(
                item => item.menuitemcode.length === 2
            );
            newCode = `${treeArrayData[treeArrayData.length - 1][
                "menuitemcode"
            ] -
                0 +
                1}`;
        } else {
            let fieldsChildren = fields.children;
            if (!fieldsChildren || fieldsChildren.length === 0) {
                let fieldsItem = fields;
                newCode = fieldsItem["menuitemcode"]
                    ? fieldsItem["menuitemcode"] + "01"
                    : "01";
            } else {
                newCode = `${fieldsChildren[fieldsChildren.length - 1][
                    "menuitemcode"
                ] -
                    0 +
                    1}`;
                newCode = Pad(
                    newCode,
                    fieldsChildren[fieldsChildren.length - 1]["menuitemcode"]
                        .length
                );
            }
        }
        this.setState({
            isedit: true,
            isNew: true,
            fields: {
                pk_menu: this.state.id,
                menuitemcode: newCode,
                menuitemname: "",
                menudes: "",
                resid: "",
                appcodeRef: {
                    refcode: "",
                    refname: "",
                    refpk: ""
                }
            },
            formData: {
                menuitemcode: "",
                menuitemname: "",
                menudes: "",
                resid: "",
                appcodeRef: {
                    refcode: "",
                    refname: "",
                    refpk: ""
                }
            }
        });
    };
    /**
     * 保存事件
     */
    save = () => {
        let { fields, isNew, parentKey } = this.state;
        this.props.form.validateFields(errors => {
            if (!errors) {
                let newFieldsData = this.props.form.getFieldsValue();
                let newFields = { ...fields, ...newFieldsData };
                let {
                    appcodeRef,
                    pk_menuitem,
                    menuitemcode,
                    menuitemname,
                    menudes,
                    pk_menu,
                    parentcode,
                    resid
                } = newFields;
                let resData, urlData;
                if (isNew) {
                    if (parentKey === "" || parentKey === "00") {
                        resData = {
                            menuitemcode,
                            menuitemname,
                            menudes,
                            pk_menu,
                            resid
                        };
                    } else {
                        resData = {
                            menuitemcode,
                            menuitemname,
                            menudes,
                            pk_menu,
                            parentcode: parentKey,
                            resid
                        };
                    }
                    urlData = `/nccloud/platform/appregister/insertappmenuitem.do`;
                    if (fields.appcodeRef) {
                        resData.appcode = appcodeRef.refcode;
                        resData.appid = appcodeRef.refpk;
                    }
                } else {
                    urlData = `/nccloud/platform/appregister/editappmenuitem.do`;
                    resData = {
                        pk_menuitem,
                        menuitemcode,
                        menuitemname,
                        menudes,
                        pk_menu,
                        parentcode,
                        resid
                    };
                    if (fields.appcodeRef) {
                        resData.appcode = appcodeRef.refcode;
                        resData.appid = appcodeRef.refpk;
                    }
                }
                Ajax({
                    url: urlData,
                    data: resData,
                    info: {
                        name: "菜单注册菜单项",
                        action: "保存"
                    },
                    success: ({ data: { data } }) => {
                        if (data) {
                            let treeData = [...this.state.treeData];
                            let newFields;
                            if (isNew) {
                                treeData = _.concat(treeData, data);
                                newFields = data;
                            } else {
                                data.map(newItem => {
                                    let dataIndex = _.findIndex(
                                        treeData,
                                        item =>
                                            item.pk_menuitem ===
                                            newItem.pk_menuitem
                                    );
                                    treeData[dataIndex] = newItem;
                                });
                                newFields = data.find(
                                    item =>
                                        item.pk_menuitem === resData.pk_menuitem
                                );
                            }
                            this.setState(
                                {
                                    isedit: false,
                                    isNew: false,
                                    treeData,
                                    fields: newFields
                                },
                                () => {
                                    this.setSelectedKeys([
                                        newFields.menuitemcode
                                    ]);
                                    if (newFields.parentcode) {
                                        this.setExpandedKeys([
                                            newFields.parentcode
                                        ]);
                                    }
                                }
                            );
                            Notice({
                                status: "success",
                                msg: data.msg
                            });
                        }
                    }
                });
            }
        });
    };
    /**
     * 删除事件
     */
    del = () => {
        confirm({
            closable: false,
            title: "是否要删除?",
            content: "",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            mask: false,
            onOk: () => {
                let fields = this.state.fields;
                if (fields.children) {
                    Notice({
                        status: "warning",
                        msg: "不是叶子节点不能删除！"
                    });
                    return;
                }
                Ajax({
                    url: `/nccloud/platform/appregister/deleteappmenuitem.do`,
                    data: {
                        pk_menuitem: fields.pk_menuitem
                    },
                    info: {
                        name: "菜单注册菜单项",
                        action: "删除"
                    },
                    success: ({ data: { data } }) => {
                        if (data) {
                            let treeData = this.state.treeData;
                            _.remove(
                                treeData,
                                item => item.pk_menuitem === fields.pk_menuitem
                            );
                            this.setState({
                                isedit: false,
                                isNew: false,
                                treeData,
                                parentKey: ""
                            });
                            Notice({
                                status: "success",
                                msg: data.true
                            });
                        }
                    }
                });
            },
            onCancel() {
                console.log("Cancel");
            }
        });
    };
    /**
     * 树查询
     */
    handleSearch = (value, callback) => {
        Ajax({
            url: `/nccloud/platform/appregister/searchappmenuitem.do`,
            data: {
                search_content: value,
                pk_menu: this.state.id
            },
            info: {
                name: "菜单项",
                action: "查询应用树"
            },
            success: res => {
                let { success, data } = res.data;
                if (success && data) {
                    this.setState(
                        {
                            treeData: data
                        },
                        () => {
                            callback(data);
                        }
                    );
                }
            }
        });
    };
    /**
     * 设置树展开节点
     * @param {Array} expandedKeys 展开的树节点数组
     */
    setExpandedKeys = expandedKeys => {
        if (expandedKeys.length === 1) {
            expandedKeys = expandedKeys.concat(this.state.expandedKeys);
        }
        expandedKeys = Array.from(new Set(expandedKeys));
        this.setState({
            expandedKeys
        });
    };
    /**
     * 设置树选中节点
     * @param {Array} selectedKeys 选中的树节点数组
     */
    setSelectedKeys = selectedKeys => {
        let selectedKey = selectedKeys[0];
        if (selectedKey === "00" || selectedKey === undefined) {
            this.setState({
                selectedKeys,
                isedit: false,
                isNew: false,
                parentKey: "",
                fields: this.newFormData,
                formData: { ...this.newFormData }
            });
            return;
        }
        let treeData = this.state.treeData;
        let treeItem = treeData.find(item => item.menuitemcode === selectedKey);
        // 防止选中应用的应用编码被修改 参照报错
        if (!treeItem.appcodeRef) {
            treeItem.appcodeRef = {
                refcode: "",
                refname: "",
                refpk: ""
            };
        }

        this.historyData = { ...treeItem };
        this.setState({
            selectedKeys,
            isedit: false,
            parentKey: selectedKey,
            fields: { ...treeItem },
            formData: {
                menuitemcode: treeItem.menuitemcode,
                menuitemname: treeItem.menuitemname,
                appcodeRef: treeItem.appcodeRef,
                resid: treeItem.resid,
                menudes: treeItem.menudes
            }
        });
    };
    /**
     * 页面跳转
     */
    pageBack = () => {
        window.history.back(-1);
    };
    componentWillMount() {
        let { id, mn, mt } = GetQuery(this.props.location.search);
        this.setState({ id, mn: mn && mn != "null" ? mn : "", mt: mt - 0 });
    }
    componentDidMount() {
        Ajax({
            url: `/nccloud/platform/appregister/queryappmenus.do`,
            data: {
                pk_menu: this.state.id
            },
            info: {
                name: "菜单项",
                action: "查询应用树"
            },
            success: res => {
                let { success, data } = res.data;
                if (success && data) {
                    this.setState({
                        treeData: data
                    });
                }
            }
        });
    }
    render() {
        let {
            treeData,
            mn,
            mt,
            isedit,
            isNew,
            fields,
            expandedKeys,
            selectedKeys,
            parentKey
        } = this.state;
        let {
            menuitemcode,
            menuitemname,
            appcodeRef,
            resid,
            menudes
        } = this.state.formData;
        let lenCheck = undefined;
        if (isNew) {
            if (parentKey.length < 6) {
                lenCheck = parentKey.length + 2;
            }
        } else {
            if (menuitemcode.length < 6) {
                lenCheck = menuitemcode.length;
            }
        }
        let menuFormData = [
            {
                code: "menuitemcode",
                type: "string",
                label: "菜单项编码",
                isRequired: true,
                isedit: isedit,
                initialValue: menuitemcode,
                len: lenCheck,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "menuitemname",
                type: "string",
                label: "菜单项名称",
                isRequired: true,
                isedit: isedit,
                initialValue: menuitemname,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                type: "refer",
                code: "appcodeRef",
                label: "关联应用编码",
                initialValue: appcodeRef,
                options: {
                    placeholder: "应用编码",
                    refName: "关联应用编码",
                    refCode: "appcodeRef",
                    refType: "tree",
                    isTreelazyLoad: false,
                    onlyLeafCanSelect: true,
                    queryTreeUrl: "/nccloud/platform/appregister/appregref.do",
                    disabled:
                        this.state.fields.menuitemcode &&
                        this.state.fields.menuitemcode.length < 8 &&
                        isedit,
                    columnConfig: [
                        {
                            name: ["编码", "名称"],
                            code: ["refcode", "refname"]
                        }
                    ],
                    isMultiSelectedEnabled: false
                },
                isedit: isedit,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "resid",
                type: "string",
                label: "多语字段",
                isRequired: false,
                isedit: isedit,
                initialValue: resid,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "menudes",
                type: "string",
                label: "菜单描述",
                isRequired: false,
                isedit: isedit,
                initialValue: menudes,
                xs: 24,
                md: 12,
                lg: 12
            }
        ];
        let btnList = [
            {
                name: "新增",
                code: "add",
                type: "primary",
                isshow:
                    ((fields.menuitemcode && fields.menuitemcode.length < 8) ||
                        this.state.parentKey === "" ||
                        this.state.parentKey === "00") &&
                    !isedit &&
                    !mt
            },
            {
                name: "修改",
                code: "edit",
                type: "primary",
                isshow:
                    this.state.parentKey !== "" &&
                    this.state.parentKey !== "00" &&
                    !isedit &&
                    !mt
            },
            {
                name: "删除",
                code: "del",
                type: "",
                isshow:
                    this.state.parentKey !== "" &&
                    this.state.parentKey !== "00" &&
                    !isedit &&
                    !mt
            },
            {
                name: "保存",
                code: "save",
                type: "primary",
                isshow: isedit
            },
            {
                name: "取消",
                code: "cancle",
                type: "",
                isshow: isedit
            }
        ];
        return (
            <PageLayout
                header={
                    <PageLayoutHeader>
                        <div>
                            <i
                                className="iconfont icon-cela"
                                onClick={this.pageBack}
                            />
                            {mn}
                        </div>
                        <ButtonCreate
                            dataSource={btnList}
                            onClick={this.handleBtnClick}
                        />
                    </PageLayoutHeader>
                }
                className="nc-workbench-menuitem"
            >
                <PageLayoutLeft>
                    <TreeSearch
                        setExpandedKeys={this.setExpandedKeys}
                        expandedKeys={expandedKeys}
                        setSelectedKeys={this.setSelectedKeys}
                        selectedKeys={selectedKeys}
                        onSearch={this.handleSearch}
                        dataSource={treeData}
                    />
                </PageLayoutLeft>
                <PageLayoutRight>
                    <div className="nc-workbench-menuitem-form">
                        {(this.state.parentKey === "" ||
                            this.state.parentKey === "00") &&
                        !isNew ? (
                            ""
                        ) : (
                            <FormContent
                                datasources={dataDefaults(
                                    this.state.formData,
                                    menuFormData,
                                    "code"
                                )}
                                form={this.props.form}
                                formData={menuFormData}
                            />
                        )}
                    </div>
                </PageLayoutRight>
            </PageLayout>
        );
    }
}
MenuItem.propTypes = {
    menuItemData: PropTypes.object.isRequired
};
MenuItem = Form.create()(MenuItem);
export default connect(
    state => {
        return {
            menuItemData: state.menuRegisterData.menuItemData
        };
    },
    {}
)(MenuItem);
