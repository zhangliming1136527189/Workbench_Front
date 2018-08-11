import React, { Component } from "react";
import { Modal, Button } from "antd";
import { high } from "nc-lightapp-front";
import Ajax from "Pub/js/ajax";
import * as utilService from './utilService';
const { Refer } = high;
//参照模态框
export default class DefaultValueModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultvalueObj: {}
        };
        this.onOkDialog = this.onOkDialog.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modalVisibel !== true) {
            return;
        } else {
            let defaultvalueObj = {};
            const {
                defaultvalue,
                isMultiSelectedEnabled,
                refname
            } = nextProps;
            if (defaultvalue !== "" && defaultvalue !== null) {
                const tmpDefaultvalueList = defaultvalue.split("=");
                defaultvalueObj = {
                    display: tmpDefaultvalueList[0],
                    value: tmpDefaultvalueList[1]
                };
            }
            if(nextProps.areatype==='0'){
                Ajax({
                    url: `/nccloud/platform/templet/getRefDefaultSel.do`,
                    info: {
                        name: "单据模板设置",
                        action: "查询参照默认下拉选项"
                    },
                    data: [refname],
                    success: res => {
                        if (res) {
                            let { data, success } = res.data;
                            let refcode;
                            if (success && data) {
                                _.forEach((data),(d)=>{
                                    refcode = d.refpath;
                                })
                                this.setState({
                                    refcode: refcode,
                                    defaultvalueObj: defaultvalueObj,
                                    isMultiSelectedEnabled: isMultiSelectedEnabled
                                });
                            }
                        }
                    }
                });
            }else{
                this.setState({
                    refcode: nextProps.refcode,
                    defaultvalueObj: defaultvalueObj,
                    isMultiSelectedEnabled: isMultiSelectedEnabled
                });
            }
            
        }
    }

    showModalHidden = () => {
        this.props.setModalVisibel("defaultValueModalVisibel", false);
    };
    onOkDialog = () => {
        let defaultvalueObj = this.state.defaultvalueObj;
        const display = defaultvalueObj.display;
        const value = defaultvalueObj.value;
        let defaultvalue = "";
        if(display !== "" && value !==""){
            defaultvalue = `${display}=${value}`
        }
        this.props.handleSelectChange(defaultvalue, "defaultvalue");
        this.showModalHidden();
    };
    render() {
        if(!this.state.refcode){
            return null;
        }
        return (
            <Modal
                title="参照默认值设置"
                mask={false}
                wrapClassName="zonesetting-defaultValueModal"
                visible={this.props.modalVisibel}
                onOk={this.onOkDialog}
                destroyOnClose={true}
                onCancel={this.showModalHidden}
                footer={[
                    <Button
                        key="submit"
                        // disabled={}
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
                <div className="mdcontent">
                    {(() => {
                        if (this.state[`myRefDom${this.state.refcode}`]) {
                            //参照的特殊写法，有问题联系艺轩
                            const myRefDom = this.state[
                                `myRefDom${this.state.refcode}`
                            ];
                            const tmpRefDom = myRefDom();
                            return (
                                    <Refer
                                        isMultiSelectedEnabled={
                                            this.state.isMultiSelectedEnabled
                                        }
                                        {...tmpRefDom.props}
                                        foolValue={this.state.defaultvalueObj}
                                        onChange={(ref, foolValue) => {
                                            this.setState({
                                                defaultvalueObj: foolValue
                                            });
                                        }}
                                    />
                            );
                        } else {
                            utilService.createScript.call(
                                this,
                                `../${this.state.refcode}`
                            );
                        }
                    })()}
                </div>
            </Modal>
        );
    }
}
