import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FormContent, dataDefaults } from "Components/FormCreate";
class ClassFromCard extends Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        let isEdit = this.props.isEdit;
        let { code, name, resid, app_desc, help_name } = this.props.nodeData;
        let classFormData = [
            {
                label: "应用编码",
                type: "string",
                code: "code",
                isRequired: true,
                len: 6,
                initialValue: code,
                isedit: isEdit
            },
            {
                label: "应用名称",
                type: "string",
                code: "name",
                isRequired: true,
                initialValue: name,
                isedit: isEdit
            },
            {
                label: "多语字段",
                type: "string",
                code: "resid",
                isRequired: false,
                initialValue: resid,
                isedit: isEdit
            },
            {
                label: "应用描述",
                type: "string",
                code: "app_desc",
                isRequired: false,
                initialValue: app_desc,
                isedit: isEdit
            },
            {
                label: "帮助文件名",
                type: "string",
                code: "help_name",
                initialValue: help_name,
                isRequired: false,
                isedit: isEdit
            }
        ];
        return (
            <FormContent
                form={this.props.form}
                formData={classFormData}
                datasources={dataDefaults(
                    this.props.nodeData,
                    classFormData,
                    "code"
                )}
            />
        );
    }
}
ClassFromCard.propTypes = {
    isEdit: PropTypes.bool.isRequired,
    nodeData: PropTypes.object.isRequired
};
export default connect(
    state => ({
        nodeData: state.AppRegisterData.nodeData,
        isEdit: state.AppRegisterData.isEdit
    }),
    {}
)(ClassFromCard);
