import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FormContent, dataDefaults } from "Components/FormCreate";
import "./index.less";
class PageCopy extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let { newPageName, newPageCode,isCopyUserTemplet } = this.props.pageCopyData;
        let pageCopyFormData = [
            {
                label: "新页面名称",
                type: "string",
                code: "newPageName",
                isRequired: true,
                isedit: true,
                initialValue: newPageName,
                lg: 24
            },
            {
                label: "新页面编码",
                type: "select",
                code: "newPageCode",
                isRequired: true,
                isedit: true,
                initialValue: newPageCode,
                options: this.props.newPageOtions,
                lg: 24
            },
            {
                label: "复制用户自定义模板",
                type: "checkbox",
                code: "isCopyUserTemplet",
                isRequired: true,
                isedit: true,
                initialValue: isCopyUserTemplet,
                lg: 12
            }
        ];
        return (
            <div className="copypage-content">
                <div className="copypage-form">
                    <FormContent
                        form={this.props.form}
                        formData={pageCopyFormData}
                        datasources={dataDefaults(
                            this.props.pageCopyData,
                            pageCopyFormData,
                            "code"
                        )}
                    />
                </div>
            </div>
        );
    }
}
PageCopy.propTypes = {
    pageCopyData: PropTypes.object.isRequired
};
export default connect(
    state => ({
        pageCopyData: state.AppManagementData.pageCopyData
    }),
    {}
)(PageCopy);
