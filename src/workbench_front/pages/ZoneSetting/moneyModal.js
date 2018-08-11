import React, { Component } from "react";
import { InputNumber, Modal, Button } from "antd";
import Notice from "Components/Notice";
//整数、小数、金融类型模态框
export default class MoneyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initVal: this.props.initVal,
            small: "",
            big: "",
            customScale: ""
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.modalVisibel !== true) {
            return;
        } else {
            this.setState({ initVal: nextProps.initVal }, () => {
                let { datatype } = nextProps;
                let { initVal } = this.state;
                if (initVal === "" || initVal === null) {
                    this.setState({
                        customScale: datatype === "4" ? 0 : 2,
                        small: "",
                        big: ""
                    });
                } else {
                    let initArray = initVal.split(",");
                    if (datatype === "4") {
                        //整数
                        this.setState({
                            customScale: 0,
                            small: initArray ? initArray[0] : "",
                            big: initArray ? initArray[1] : ""
                        });
                    } else {
                        this.setState({
                            customScale: initArray ? initArray[0] : 2,
                            small: initArray ? initArray[1] : "",
                            big: initArray ? initArray[2] : ""
                        });
                    }
                }
            });
        }
    }
    showModalHidden = () => {
        this.props.setModalVisibel("moneyModalVisibel", false);
    };
    onOkDialog = () => {
        let { small, big, customScale } = this.state;
        let { datatype } = this.props;
        let result;
        if (small !== "" && big !== "") {
            if (Number(small) >= Number(big)) {
                return Notice({
                    status: "error",
                    msg: "所选的最小值与最大值不匹配"
                });
            }
        }
        if (datatype === "4") {
            //整数
            result = `${small},${big}`;
        } else {
            result = `${customScale},${small},${big}`;
        }
        this.props.handleSelectChange(result, "dataval");
        this.showModalHidden();
    };
    saveValue = (key, val) => {
        if (_.isNull(val) || _.isUndefined(val)) {
            val = "";
        }
        this.setState({ [key]: val });
    };
    render() {
        let { customScale, small, big } = this.state;
        let { datatype } = this.props;
        return (
            <div className="myZoneModal">
                <Modal
                    closable={false}
                    title="类型设置"
                    mask={false}
                    wrapClassName="zonesetting-moneyModal"
                    visible={this.props.modalVisibel}
                    onOk={this.onOkDialog}
                    destroyOnClose={true}
                    onCancel={this.showModalHidden}
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
                    {(() => {
                        if (datatype !== "4") {
                            //不是整数时
                            return (
                                <div>
                                    <div className="descrip_label">
                                        精度设置{" "}
                                    </div>
                                    <div className="mdcontent">
                                        <div>
                                            <span className="money-label">
                                                {" "}
                                                自定义精度:
                                            </span>
                                            <InputNumber
                                                precision={0}
                                                min={0}
                                                max={8}
                                                value={customScale}
                                                onChange={value => {
                                                    this.saveValue(
                                                        "customScale",
                                                        value
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })()}
                    <div>
                        <div className="descrip_label">取值设置 </div>
                        <div className="mdcontent">
                            <div>
                                <span className="money-label">最小值:</span>
                                <InputNumber
                                    precision={customScale}
                                    value={small}
                                    onChange={value => {
                                        this.saveValue("small", value);
                                    }}
                                />
                            </div>
                            <div>
                                <span className="money-label">最大值:</span>
                                <InputNumber
                                    value={big}
                                    precision={customScale}
                                    onChange={value => {
                                        this.saveValue("big", value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
