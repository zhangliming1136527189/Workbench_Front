import React, { Component } from "react";
import _ from "lodash";
import { Modal, Form } from "antd";
import {
    PageLayout,
    PageLayoutHeader,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
import TreeCom from "./TreeCom";
import ButtonCreate from "Components/ButtonCreate";
import { FormContent, dataDefaults } from "Components/FormCreate";
import Ajax from "Pub/js/ajax.js";
import Notice from "Components/Notice";
import "./index.less";
Modal.mask = false;
const confirm = Modal.confirm;
class IndividuationRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            fields: {},
            formData: {},
            isNew: false,
            isedit: false,
            parentKey: "",
            selectedKeys: ["00"]
        };
        this.newFormData = {
            code: "",
            name: "",
            resourceid: "",
            resourcepath: "",
            page_part_url: ""
        };
        this.historyData;
    }
    /**
     * 个性化注册所有按钮点击事件
     * @param {String} key 按钮code
     */
    handleBtnClick = key => {
        switch (key) {
            case "add":
                this.setState({
                    isedit: true,
                    isNew: true,
                    fields: { ...this.newFormData },
                    formData: { ...this.newFormData }
                });
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
                        code: this.historyData.code,
                        name: this.historyData.name,
                        resourceid: this.historyData.resourceid,
                        resourcepath: this.historyData.resourcepath,
                        page_part_url: this.historyData.page_part_url
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
                let pk_individualreg = this.state.fields.pk_individualreg;
                Ajax({
                    url: `/nccloud/platform/appregister/deleteindividualreg.do`,
                    info: {
                        name: "个性化注册",
                        action: "删除"
                    },
                    data: {
                        pk_individualreg
                    },
                    success: ({ data: { data } }) => {
                        if (data) {
                            let { treeData } = this.state;
                            treeData = [...this.state.treeData];
                            _.remove(
                                treeData,
                                item =>
                                    item.pk_individualreg === pk_individualreg
                            );
                            this.setState({
                                treeData,
                                parentKey: "",
                                selectedKeys: ["00"]
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
     * 保存事件
     */
    save = () => {
        this.props.form.validateFields(errors => {
            if (!errors) {
                let { isNew, fields } = this.state;
                let saveURL, data;
                let newFieldsData = this.props.form.getFieldsValue();
                let newFields = { ...fields, ...newFieldsData };
                if (isNew) {
                    saveURL = `/nccloud/platform/appregister/insertindividualreg.do`;
                    data = newFields;
                } else {
                    saveURL = `/nccloud/platform/appregister/editindividualreg.do`;
                    data = newFields;
                }
                Ajax({
                    url: saveURL,
                    info: {
                        name: "个性化注册",
                        action: "保存"
                    },
                    data: data,
                    success: ({ data: { data } }) => {
                        if (data) {
                            let treeData = [...this.state.treeData];
                            if (isNew) {
                                treeData = _.concat(treeData, data);
                                newFields = data;
                            } else {
                                let dataIndex = _.findIndex(
                                    treeData,
                                    item =>
                                        item.pk_individualreg ===
                                        fields.pk_individualreg
                                );
                                treeData[dataIndex] = newFields;
                            }
                            this.setState(
                                {
                                    isNew: false,
                                    isedit: false,
                                    selectedKeys: [fields.code],
                                    parentKey: fields.code,
                                    treeData,
                                    fields: newFields,
                                    formData: { ...newFieldsData }
                                },
                                () => {
                                    this.handleSelect(newFields.code);
                                }
                            );
                            Notice({
                                status: "success",
                                msg: data.true ? data.true : "保存成功！"
                            });
                        }
                    }
                });
            }
        });
    };
    /**
     * 树节点选中事件
     * @param {String} selectedKey
     */
    handleSelect = selectedKey => {
        let { treeData, selectedKeys } = this.state;
        if (selectedKey === "00" || selectedKey === undefined) {
            selectedKeys = ["00"];
            this.setState({
                isedit: false,
                selectedKeys,
                parentKey: selectedKey ? selectedKey : "",
                fields: { ...this.newFormData },
                formData: { ...this.newFormData }
            });
            return;
        }
        selectedKeys = [selectedKey];
        let treeItem = treeData.find(item => item.code === selectedKey);
        this.historyData = { ...treeItem };
        this.setState({
            isedit: false,
            isNew: false,
            selectedKeys,
            parentKey: selectedKey,
            fields: { ...treeItem },
            formData: {
                code: treeItem.code,
                name: treeItem.name,
                resourceid: treeItem.resourceid,
                resourcepath: treeItem.resourcepath,
                page_part_url: treeItem.page_part_url
            }
        });
    };
    /**
     * 表单任一字段值改变操作
     * @param {String|Object} changedFields 改变的字段及值
     */
    handleFormChange = changedFields => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields }
        }));
    };
    componentDidMount() {
        Ajax({
            url: `/nccloud/platform/appregister/queryindividualreg.do`,
            info: {
                name: "个性化注册",
                action: "查询"
            },
            success: res => {
                let { success, data } = res.data;
                if (success && data) {
                    this.setState({ treeData: data });
                }
            }
        });
    }
    render() {
        let {
            treeData,
            formData,
            fields,
            isedit,
            isNew,
            selectedKeys
        } = this.state;
        let { code, name, resourceid, resourcepath, page_part_url } = formData;
        let individuationFormData = [
            {
                code: "code",
                type: "string",
                label: "编码",
                isRequired: true,
                isedit: isedit,
                initialValue: code,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "name",
                type: "string",
                label: "名称",
                isRequired: true,
                isedit: isedit,
                initialValue: name,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "resourceid",
                type: "string",
                label: "名称->资源ID",
                isRequired: true,
                isedit: isedit,
                initialValue: resourceid,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "resourcepath",
                type: "string",
                label: "名称->资源路径",
                isRequired: true,
                isedit: isedit,
                initialValue: resourcepath,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "page_part_url",
                type: "string",
                label: "页面片段URL",
                isRequired: true,
                initialValue: page_part_url,
                isedit: isedit
            }
        ];
        let btnList = [
            {
                name: "新增",
                code: "add",
                type: "primary",
                isshow:
                    (this.state.parentKey === "" ||
                        this.state.parentKey === "00") &&
                    !isedit
            },
            {
                name: "修改",
                code: "edit",
                type: "primary",
                isshow:
                    this.state.parentKey !== "" &&
                    this.state.parentKey !== "00" &&
                    !isedit
            },
            {
                name: "删除",
                code: "del",
                type: "",
                isshow:
                    this.state.parentKey !== "" &&
                    this.state.parentKey !== "00" &&
                    !isedit
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
                className="nc-workbench-individuation"
                header={
                    <PageLayoutHeader>
                        <div>个性化注册</div>
                        <ButtonCreate
                            dataSource={btnList}
                            onClick={this.handleBtnClick}
                        />
                    </PageLayoutHeader>
                }
            >
                <PageLayoutLeft>
                    <TreeCom
                        selectedKeys={selectedKeys}
                        onSelect={this.handleSelect}
                        dataSource={treeData}
                    />
                </PageLayoutLeft>
                <PageLayoutRight>
                    <div className="nc-workbench-individuation-form">
                        {(this.state.parentKey === "" ||
                            this.state.parentKey === "00") &&
                        !isNew ? (
                            ""
                        ) : (
                            <FormContent
                                datasources={dataDefaults(
                                    this.state.formData,
                                    individuationFormData,
                                    "code"
                                )}
                                form={this.props.form}
                                formData={individuationFormData}
                            />
                        )}
                    </div>
                </PageLayoutRight>
            </PageLayout>
        );
    }
}
IndividuationRegister = Form.create()(IndividuationRegister);
export default IndividuationRegister;
