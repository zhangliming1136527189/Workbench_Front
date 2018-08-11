import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "antd";
import DefdocListGridRef from "Components/Refers/DefdocListGridRef";

class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initVal: this.props.initVal
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ initVal: nextProps.initVal });
    }
    showModalHidden = () => {
        this.props.setModalVisibel("customModalVisibel", false);
    };
    onOkDialog = () => {
        let { initVal } = this.state;
        this.props.handleSelectChange(initVal, "dataval"); // 特殊处理下 这里是对象
        this.showModalHidden();
    };

    render() {
        let { initVal } = this.state;
        return (
            <div className="myZoneModal">
                <Modal
                    closable={false}
                    title="类型设置"
                    mask={false}
                    wrapClassName="zonesetting-customModal"
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
                    <DefdocListGridRef
                        value={{ refpk: initVal, refname: "", refcode: "" }}
                        placeholder={"自定义档案"}
                        onChange={val => {
                            this.setState({
                                initVal: val && val.refpk
                            });
                        }}
                    />
                </Modal>
            </div>
        );
    }
}
export default connect(
    state => ({}),
    {}
)(CustomModal);
