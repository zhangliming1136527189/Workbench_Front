import React, { Component } from "react";
import { Icon } from "antd";
/**
 * 表格编辑单元格 - 公共组件
 */
class EditableCellPublic extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        /**
         * @param {String} value 值
         * @param {Function} setCellEdit 设置单元编辑性
         */
        let { value, setCellEdit } = this.props;
        return (
            <div
                style={{ paddingRight: 24, width: "100%", minHeight: "19px" }}
                onClick={() => {
                    setCellEdit(true);
                }}
            >
                {value || ""}
                <Icon type="edit" className="editable-cell-icon" />
            </div>
        );
    }
}
export default EditableCellPublic;
