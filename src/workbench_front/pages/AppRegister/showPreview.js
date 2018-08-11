import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "antd";
import { updatePreviewData } from "Store/ZoneSetting/action";
import { createPage } from "nc-lightapp-front";
import initTemplate from "./events";

class PreviewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            searchs: [],
            tables: []
        };
    }
    showModalHidden = () => {
        this.props.setModalVisibel(false);
    };
    onOkDialog = () => {
        this.props.setModalVisibel(false);
    };
    createDom = () => {
        let { editTable, form, search } = this.props;
        let { createForm } = form;
        let { createEditTable } = editTable;
        let { NCCreateSearch } = search;
        let { forms, tables, searchs } = this.state;
        let result = [];
        // 表单
        if (forms.length) {
            forms.map((val, i) => {
                result.push(
                    <div className="area" key={`form${i}`}>
                        <div className="descrip">
                            <span key={`forms${i}`}> ▼ </span>
                            {`表单区${i + 1}_${val.name}`}
                        </div>
                        {createForm(val.id)}
                    </div>
                );
            });
        }
        // 查询区
        if (searchs.length) {
            searchs.map((val, i) => {
                result.push(
                    <div className="area" key={`search${i}`}>
                        <div className="descrip">
                            <span key={`searchs${i}`}> ▼ </span>
                            {`查询区${i + 1}_${val.name}`}
                        </div>
                        {NCCreateSearch(val.id)}
                    </div>
                );
            });
        }
        // 表格
        if (tables.length) {
            tables.map((val, i) => {
                result.push(
                    <div className="area" key={`table${i}`}>
                        <div className="descrip">
                            <span key={`tables${i}`}> ▼ </span>
                            {`表格区${i + 1}_${val.name}`}
                        </div>
                        {createEditTable(val.id, {})}
                    </div>
                );
            });
        }
        return result;
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.previewData) {
            let reviewData = nextProps.previewData;
            let search = [],
                form = [],
                table = [];
            reviewData.forEach((v, i) => {
                if (
                    Object.keys(v) &&
                    v[Object.keys(v)[0]] &&
                    v[Object.keys(v)[0]].moduletype
                ) {
                    let key = v[Object.keys(v)[0]].moduletype;
                    let name = v[Object.keys(v)[0]].name;
                    switch (key) {
                        case "form":
                            form.push({ id: Object.keys(v)[0], name: name });
                            break;
                        case "table":
                            table.push({ id: Object.keys(v)[0], name: name });
                            break;
                        case "search":
                            search.push({ id: Object.keys(v)[0], name: name });
                            break;
                        default:
                            break;
                    }
                }
            });
            //  更新state;
            this.setState({
                searchs: search,
                tables: table,
                forms: form
            });
        }
    }
    render() {
        let { editTable, form, search } = this.props;
        console.log(this.props.previewData);
        return (
            <Modal
                maskClosable={false}
                closable={false}
                title="预览区"
                mask={false}
                visible={this.props.batchSettingModalVisibel}
                onOk={this.onOkDialog}
                onCancel={this.showModalHidden}
                width="95%"
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        onClick={this.onOkDialog}
                    >
                        确定
                    </Button>,
                    <Button key="back" onClick={this.showModalHidden}>
                        取消
                    </Button>
                ]}
            >
                {this.createDom()}
            </Modal>
        );
    }
}

PreviewModal = createPage({
    initTemplate: initTemplate
})(PreviewModal);

export default connect(
    state => {
        return {
            areaList: state.zoneSettingData.areaList,
            previewData: state.zoneSettingData.previewData
        };
    },
    {
        updatePreviewData
    }
)(PreviewModal);
