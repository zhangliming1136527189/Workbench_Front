import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { Input, Modal, Button } from "antd";
import { updateAreaList } from "Store/ZoneSetting/action";
//添加非元数据模态框
class AddNotMetaDataModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notMetaDataName: "",
            notMetaDataCode: "",
            explainForName: "",
            explainForCode: ""
        };
    }
    showModalHidden = () => {
        this.props.setAddDataModalVisibel(false);
    };
    onOkDialog = () => {
        let { areaList, areaIndex } = this.props;
        let queryPropertyList = areaList[areaIndex].queryPropertyList;
        let cardObj = {};
        if (this.props.areatype === "0") {
            //查询区
            cardObj = {
                pk_query_property: "newNotMetaData" + new Date().getTime(),
                areaid: areaList[areaIndex].pk_area,
                label: this.state.notMetaDataName,
                code: this.state.notMetaDataCode,
                metapath: "",
                isnotmeta: true,
                isuse: true,
                position: `${queryPropertyList.length + 1}`,
                opersign: "=@>@>=@<@<=@like@",
                opersignname: "等于@大于@大于等于@小于@小于等于@相似@",
                defaultvalue: "",
                isfixedcondition: false,
                required: false,
                disabled: false,
                visible: true,
                ismultiselectedenabled: false,
                isquerycondition: false,
                datatype: "1",
                refname: "-99",
                containlower: false,
                ischeck: false,
                isbeyondorg: false,
                usefunc: false,
                showtype: "1",
                returntype: "refpk",
                define1: "",
                define2: "",
                define3: "",
                define4: "",
                define5: "",
                itemtype: "input",
                visibleposition: ""
            };
        } else {
            //非查询区
            cardObj = {
                pk_query_property: "newNotMetaData" + new Date().getTime(),
                areaid: areaList[areaIndex].pk_area,
                code: this.state.notMetaDataCode,
                datatype: "1",
                label: this.state.notMetaDataName,
                position: `${queryPropertyList.length + 1}`,
                metapath: "",
                color: "#6E6E77",
                isrevise: false,
                required: false,
                disabled: false,
                visible: true,
                maxlength: "20",
                defaultvalue: "",
                defaultvar: "",
                define1: "",
                define2: "",
                define3: "",
                itemtype: "input"
            };
        }
        if (this.props.areatype === "1") {
            //表单
            cardObj.colnum = "1";
            cardObj.isnextrow = false;
        }
        if (this.props.areatype === "2") {
            //表格
            cardObj.width = "";
            cardObj.istotal = false;
        }
        areaList[areaIndex].queryPropertyList = queryPropertyList.concat(
            cardObj
        );
        this.setState({
            notMetaDataName: "",
            notMetaDataCode: "",
            explainForName: "",
            explainForCode: ""
        });
        this.props.updateAreaList(areaList);
        this.showModalHidden();
    };
    isUniqueInQueryList = checkCode => {
        let { areaList, areaIndex } = this.props;
        let queryPropertyList = areaList[areaIndex].queryPropertyList;
        let flag = true;
        _.forEach(queryPropertyList, q => {
            if (q.code === checkCode) {
                flag = false;
                return false;
            }
        });
        return flag;
    };
    checkDataCorrect = (checkedStr, type) => {
        let correct = true;
        let errorMsg = "";
        if (type === "code") {
            if (checkedStr === "") {
                errorMsg = "不能为空";
                correct = false;
            } else {
                //含中文正则
                let strRegExp = /[\u4e00-\u9fa5]/;
                if (strRegExp.test(checkedStr)) {
                    errorMsg = "不能为中文";
                    correct = false;
                }
                if (!this.isUniqueInQueryList(checkedStr)) {
                    errorMsg = "不能编码重复";
                    correct = false;
                }
            }
        } else {
            if (checkedStr === "") {
                errorMsg = "不能为空";
                correct = false;
            }
        }
        return { correct: correct, errorMsg: errorMsg };
    };
    checkNameAndCodeCorrect = () => {
        let flag = false;
        const { notMetaDataName, notMetaDataCode } = this.state;
        if (
            this.checkDataCorrect(notMetaDataName).correct &&
            this.checkDataCorrect(notMetaDataCode, "code").correct
        ) {
            flag = true;
        }
        return flag;
    };
    onPressEnter = () => {
        if (!this.checkNameAndCodeCorrect()) {
            return;
        }
        this.onOkDialog();
    };
    changeNotMetaDataName = e => {
        this.setState({ notMetaDataName: e.target.value });
        const { correct, errorMsg } = this.checkDataCorrect(e.target.value);
        this.setState({ explainForName: errorMsg });
    };
    changeNotMetaDataCode = e => {
        this.setState({ notMetaDataCode: e.target.value });
        const { correct, errorMsg } = this.checkDataCorrect(
            e.target.value,
            "code"
        );
        this.setState({ explainForCode: errorMsg });
    };
    componentWillUpdate = (nextProps, nextState) => {
        if (!this.props.addDataModalVisibel && nextProps.addDataModalVisibel) {
            setTimeout(() => {
                this.refs.addNotMetaDataInputDom.focus();
            }, 0);
        }
    };
    render() {
        return (
            <Modal
                closable={false}
                title="新增"
                mask={false}
                wrapClassName="vertical-center-modal add-not-meta-data"
                visible={this.props.addDataModalVisibel}
                onOk={this.onOkDialog}
                onCancel={this.showModalHidden}
                footer={[
                    <Button
                        key="submit"
                        disabled={!this.checkNameAndCodeCorrect()}
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
                <div>
                    <div ref="addNotMetaNameDiv">
                        <span>非元数据名称：</span>
                        <Input
                            className={
                                this.state.explainForName === ""
                                    ? ""
                                    : "has-error"
                            }
                            ref="addNotMetaDataInputDom"
                            placeholder="请输入非元数据名称"
                            value={this.state.notMetaDataName}
                            onChange={this.changeNotMetaDataName}
                            onPressEnter={this.onPressEnter}
                        />
                        <span
                            style={{
                                visibility:
                                    this.state.explainForName === ""
                                        ? "hidden"
                                        : "visible"
                            }}
                            className="form-explain"
                        >
                            {this.state.explainForName}
                        </span>
                    </div>
                    <div className="code-div" ref="addNotMetaCodeDiv">
                        <span>非元数据编码：</span>
                        <Input
                            className={
                                this.state.explainForCode === ""
                                    ? ""
                                    : "has-error"
                            }
                            placeholder="请输入非元数据编码，非中文"
                            value={this.state.notMetaDataCode}
                            onChange={this.changeNotMetaDataCode}
                            onPressEnter={this.onPressEnter}
                        />
                        <span
                            style={{
                                visibility:
                                    this.state.explainForCode === ""
                                        ? "hidden"
                                        : "visible"
                            }}
                            className="form-explain"
                        >
                            {this.state.explainForCode}
                        </span>
                    </div>
                </div>
            </Modal>
        );
    }
}
export default connect(
    state => ({
        areaList: state.zoneSettingData.areaList
    }),
    {
        updateAreaList
    }
)(AddNotMetaDataModal);
