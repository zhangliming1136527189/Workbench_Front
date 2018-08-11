import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FormContent, dataDefaults } from "Components/FormCreate";
import { setNodeData } from "Store/AppRegister/action";
import PageTable from "./PageTable";
class PageFormCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let isEdit = this.props.isEdit;
        let {
            pagecode,
            pagename,
            pageurl,
            isdefault,
            resid,
            pagedesc
        } = this.props.nodeData;
        let pageFormData = [
            {
                label: "页面编码",
                type: "string",
                code: "pagecode",
                isRequired: true,
                initialValue: pagecode,
                isedit: isEdit,
                lg: 12
            },
            {
                label: "页面名称",
                type: "string",
                code: "pagename",
                isRequired: true,
                initialValue: pagename,
                isedit: isEdit,
                lg: 12
            },
            {
                label: "页面地址",
                type: "string",
                code: "pageurl",
                isRequired: true,
                initialValue: pageurl,
                isedit: isEdit,
                md: 24,
                lg: 24,
                xl: 24
            },
            {
                label: "设为默认页面",
                type: "checkbox",
                code: "isdefault",
                isRequired: true,
                initialValue: isdefault,
                isedit: isEdit,
                lg: 12
            },
            {
                label: "多语字段",
                type: "string",
                code: "resid",
                isRequired: false,
                initialValue: resid,
                isedit: isEdit,
                lg: 12
            },
            {
                label: "页面描述",
                type: "string",
                code: "pagedesc",
                isRequired: false,
                initialValue: pagedesc,
                isedit: isEdit,
                md: 24,
                lg: 24,
                xl: 24
            }
        ];
        return (
            <div>
                <FormContent
                    form={this.props.form}
                    formData={pageFormData}
                    datasources={dataDefaults(
                        this.props.nodeData,
                        pageFormData,
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
                    <PageTable />
                </div>
            </div>
        );
    }
}
PageFormCard.propTypes = {
    isEdit: PropTypes.bool.isRequired,
    nodeData: PropTypes.object.isRequired,
    setNodeData: PropTypes.func.isRequired
};
export default connect(
    state => ({
        nodeData: state.AppRegisterData.nodeData,
        isEdit: state.AppRegisterData.isEdit
    }),
    { setNodeData }
)(PageFormCard);
