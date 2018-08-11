import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FormContent, dataDefaults } from "Components/FormCreate";
import AppTable from "./AppTable";
import Ajax from "Pub/js/ajax";
const IMGS = [
    {
        name: "img1",
        value: "toupiao",
        src: "toupiao"
    },
    {
        name: "img2",
        value: "wenku",
        src: "wenku"
    },
    {
        name: "img3",
        value: "rizhi",
        src: "rizhi"
    },
    {
        name: "img4",
        value: "xinzifafang",
        src: "xinzifafang"
    },
    {
        name: "img5",
        value: "gonggao",
        src: "gonggao"
    },
    {
        name: "img6",
        value: "huati",
        src: "huati"
    },
    {
        name: "img7",
        value: "zuzhiguanli",
        src: "zuzhiguanli"
    },
    {
        name: "img8",
        value: "jiaqin",
        src: "jiaqin"
    }
];
class AppFromCard extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            orgtypecode: [],
            target_path: []
        };
    }
    /**
     * 获取组织类型 下拉数据
     * @param {String} code
     */
    getOptionsData = (code, nodeData) => {
        let url, data, info;
        if (JSON.stringify(nodeData) === "{}") {
            return;
        }
        if (code === "target_path") {
            url = `/nccloud/platform/appregister/querypagesel.do`;
            data = { pk_appregister: nodeData.pk_appregister };
            info = {
                name: "默认页面",
                action: "查询"
            };
        } else {
            if (this.state.orgtypecode.length > 0) {
                return;
            }
            url = `/nccloud/platform/appregister/queryorgtype.do`;
            info = {
                name: "组织类型",
                action: "查询"
            };
        }
        Ajax({
            url: url,
            data: data,
            info: info,
            success: ({ data: { success, data } }) => {
                if (success && data) {
                    if (code === "target_path") {
                        this.setState({ target_path: data });
                    } else {
                        let options = data.rows;
                        options = options.map((option, i) => {
                            return {
                                value: option.refpk,
                                text: option.refname
                            };
                        });
                        this.setState({ orgtypecode: options });
                    }
                }
            }
        });
    };
    componentWillReceiveProps(nextProps, nextState) {
        if (
            nextProps.nodeData &&
            this.props.nodeData.pk_appregister !==
                nextProps.nodeData.pk_appregister
        ) {
            this.getOptionsData("orgtypecode", nextProps.nodeData);
            this.getOptionsData("target_path", nextProps.nodeData);
        }
    }
    componentDidMount() {
        this.getOptionsData("orgtypecode", this.props.nodeData);
        this.getOptionsData("target_path", this.props.nodeData);
    }
    render() {
        let isEdit = this.props.isEdit;
        let resNodeData = this.props.form.getFieldsValue();
        let apptypeNum = "1";
        if (resNodeData) {
            apptypeNum = resNodeData.apptype;
        }
        let {
            code,
            name,
            orgtypecode,
            fun_property,
            funtype,
            apptype,
            width,
            height,
            mdidRef,
            isenable,
            uselicense_load,
            iscauserusable,
            iscopypage,
            target_path,
            pk_group,
            resid,
            help_name,
            app_desc,
            image_src
        } = this.props.nodeData;
        let appFormData = [
            {
                label: "应用编码",
                type: "string",
                code: "code",
                isRequired: true,
                isedit: isEdit,
                initialValue: code,
                lg: 8
            },
            {
                label: "应用名称",
                type: "string",
                code: "name",
                isRequired: true,
                isedit: isEdit,
                initialValue: name,
                lg: 8
            },
            {
                label: "组织类型",
                type: "select",
                code: "orgtypecode",
                isRequired: true,
                options: this.state.orgtypecode,
                isedit: isEdit,
                initialValue: orgtypecode,
                lg: 8
            },
            {
                label: "功能性质",
                type: "select",
                code: "fun_property",
                isRequired: true,
                initialValue: fun_property,
                options: [
                    {
                        value: "0",
                        text: "可执行功能"
                    },
                    {
                        value: "1",
                        text: "附属功能"
                    }
                ],
                isedit: isEdit,
                lg: 8
            },
            {
                label: "功能点类型",
                type: "select",
                code: "funtype",
                isRequired: true,
                initialValue: funtype,
                options: [
                    {
                        value: "0",
                        text: "业务类应用"
                    },
                    {
                        value: "1",
                        text: "管理类应用"
                    },
                    {
                        value: "2",
                        text: "系统类应用"
                    },
                    {
                        value: "3",
                        text: "管理+业务类应用"
                    }
                ],
                isedit: isEdit,
                lg: 8
            },
            {
                label: "应用类型",
                type: "select",
                code: "apptype",
                isRequired: true,
                initialValue: apptype,
                options: [
                    {
                        value: "1",
                        text: "小应用"
                    },
                    {
                        value: "2",
                        text: "小部件"
                    }
                ],
                isedit: isEdit,
                lg: 8
            },
            {
                label: "应用宽",
                type: "string",
                code: "width",
                isRequired: true,
                initialValue: width,
                isedit: apptypeNum === "1" ? false : isEdit,
                lg: 8
            },
            {
                label: "应用高",
                type: "string",
                code: "height",
                isRequired: true,
                initialValue: height,
                isedit: apptypeNum === "1" ? false : isEdit,
                lg: 8
            },
            {
                label: "关联元数据ID",
                type: "refer",
                code: "mdidRef",
                isRequired: false,
                initialValue: mdidRef,
                options: {
                    queryTreeUrl:
                        "/nccloud/riart/ref/mdClassDefaultEntityRefTreeAction.do",
                    refType: "tree",
                    isTreelazyLoad: false,
                    placeholder: "关联元数据ID"
                },
                isedit: isEdit,
                lg: 8
            },
            {
                label: "启用",
                type: "checkbox",
                code: "isenable",
                isRequired: false,
                isedit: isEdit,
                initialValue: isenable,
                lg: 8
            },
            {
                label: "加载占用许可",
                type: "checkbox",
                code: "uselicense_load",
                isRequired: false,
                isedit: isEdit,
                initialValue: uselicense_load,
                lg: 8
            },
            {
                label: "CA用户可用",
                type: "checkbox",
                code: "iscauserusable",
                isRequired: false,
                isedit: isEdit,
                initialValue: iscauserusable,
                lg: 8
            },
            {
                label: "可复制页面",
                type: "checkbox",
                code: "iscopypage",
                isRequired: false,
                isedit: isEdit,
                initialValue: iscopypage,
                lg: 8
            },
            {
                label: apptypeNum === "1" ? "默认页面" : "小部件路径",
                type: apptypeNum === "1" ? "select" : "string",
                code: "target_path",
                isRequired: apptypeNum === "2",
                options: this.state.target_path,
                isedit: isEdit,
                initialValue: target_path,
                lg: 8
            },
            {
                label: "所属集团",
                type: "string",
                code: "pk_group",
                isRequired: false,
                isedit: false,
                initialValue: pk_group,
                lg: 8
            },
            {
                label: "多语字段",
                type: "string",
                code: "resid",
                isRequired: false,
                isedit: isEdit,
                initialValue: resid,
                lg: 8
            },
            {
                label: "帮助文件名",
                type: "string",
                code: "help_name",
                isRequired: false,
                isedit: isEdit,
                initialValue: help_name,
                lg: 8
            },
            {
                label: "应用描述",
                type: "string",
                code: "app_desc",
                isRequired: false,
                initialValue: app_desc,
                md: 24,
                lg: 8,
                xl: 24,
                isedit: isEdit
            },
            {
                label: "图标路径",
                type: "chooseImage",
                code: "image_src",
                isRequired: apptypeNum === "1",
                options: IMGS,
                hidden: apptypeNum === "2",
                initialValue: image_src,
                md: 24,
                lg: 24,
                xl: 24,
                isedit: isEdit
            }
        ];
        return (
            <div>
                <FormContent
                    form={this.props.form}
                    formData={appFormData}
                    datasources={dataDefaults(
                        this.props.nodeData,
                        appFormData.filter(item => item.hidden === false),
                        "code"
                    )}
                />
                <div
                    style={{
                        marginTop: "30px",
                        background: "#ffffff",
                        borderRadius: "6px"
                    }}
                >
                    <AppTable />
                </div>
            </div>
        );
    }
}
AppFromCard.propTypes = {
    isEdit: PropTypes.bool.isRequired,
    nodeData: PropTypes.object.isRequired
};
export default connect(
    state => ({
        nodeData: state.AppRegisterData.nodeData,
        isEdit: state.AppRegisterData.isEdit
    }),
    {}
)(AppFromCard);
