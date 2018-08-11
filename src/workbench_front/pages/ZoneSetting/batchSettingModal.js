import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "antd";
import { updateAreaList } from "Store/ZoneSetting/action";
import BatchTable from "./batchTable";
//批量设置模态框
class BatchSettingModal extends Component {
    constructor(props) {
        super(props);
        let { areaList, areaIndex } = this.props;
        this.state = {
            newSource: areaList[areaIndex].queryPropertyList
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.batchSettingModalVisibel !== true) {
            return;
        } else {
            let { areaList, areaIndex } = nextProps;
            this.setState({ newSource: areaList[areaIndex].queryPropertyList });
        }
    }
    showModalHidden = () => {
        this.props.setModalVisibel(false);
    };
    onOkDialog = () => {
        let { areaList, areaIndex } = this.props;
        areaList = _.cloneDeep(areaList);
        areaList[areaIndex].queryPropertyList = this.state.newSource;
        this.props.updateAreaList(areaList);
        this.showModalHidden();
    };
    saveNewSource = newSource => {
        this.setState({ newSource });
    };
    render() {
        let { areaIndex, areaList } = this.props;
        let { newSource } = this.state;
        return (
            <Modal
                closable={false}
                className="zonesetting-batch-setting-modal"
                title="批量设置-卡片区"
                mask={false}
                visible={this.props.batchSettingModalVisibel}
                onOk={this.onOkDialog}
                destroyOnClose={true}
                onCancel={this.showModalHidden}
                width="99%"
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
                <BatchTable
                    newSource={newSource}
                    areatype={areaList[areaIndex].areatype}
                    saveNewSource={this.saveNewSource}
                />
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
)(BatchSettingModal);
