import React, { Component } from "react";
import _ from "lodash";
import { Button, Modal, Radio } from "antd";
//自定义组件
import { compactLayoutHorizontal } from "./compact.js";
import { connect } from "react-redux";
import { updateGroupList } from "Store/test/action";
import * as utilService from "./utilService";
const RadioGroup = Radio.Group;

class MyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: 0
        };
    }
    showModalHidden = () => {
        this.setModalVisible(false);
    };
    setModalVisible = modalVisible => {
        this.setState({ selectedValue: 0 });
        this.props.setModalVisible(modalVisible);
    };
    //移动到的弹出框中，点击确认
    onOkMoveDialog = () => {
        const modalVisible = false;
        const targetGroupID = this.state.selectedValue;
        let { appGroupArr } = this.props;
        let { groups } = this.props;
        groups = _.cloneDeep(groups);
        const targetGroupIndex = utilService.getGroupIndexByGroupID(
            groups,
            targetGroupID
        );

        let checkedAppList = [];
        if (targetGroupID === 0) {
            return;
        }
        _.forEach(appGroupArr, a => {
            _.forEach(a.children, c => {
                if (c.checked) {
                    checkedAppList.push({
                        cardid: c.value,
                        width: c.width,
                        height: c.height,
                        name: c.label,
                        isShadow: false,
                        gridx: 999,
                        gridy: 999
                    });
                    c.checked = false;
                }
            });
            a.checkedAll = false;
            a.indeterminate = false;
        });

        groups[targetGroupIndex].apps = _.concat(
            groups[targetGroupIndex].apps,
            checkedAppList
        );
        groups[targetGroupIndex].apps = _.uniqBy(
            groups[targetGroupIndex].apps,
            "cardid"
        );
        //目标组内重新布局
        let compactedLayout = compactLayoutHorizontal(
            groups[targetGroupIndex].apps,
            this.props.col
        );

        groups[targetGroupIndex].apps = compactedLayout;

        this.props.updateGroupList(groups);
        this.setModalVisible(modalVisible);
    };
    //移动到的弹出框中，组名选择
    onChangeRadio(e) {
        this.setState({ selectedValue: e.target.value });
    }
    //通过组名来创建Radio
    getGroupItemNameRadio() {
        const { groups } = this.props;
        if (!groups) return;
        return (
            <RadioGroup
                className="modal-radio-group"
                value={this.state.selectedValue}
                onChange={this.onChangeRadio.bind(this)}
            >
                {groups.map((g, i) => {
                    return (
                        <Radio
                            className="modal-radio"
                            key={g.pk_app_group}
                            value={g.pk_app_group}
                        >
                            {g.groupname}
                        </Radio>
                    );
                })}
            </RadioGroup>
        );
    }
    shouldComponentUpdate(nextProps, nextState) {
        //若选择和显示与否变化则重新render
        if (this.props.modalVisible !== nextProps.modalVisible) {
            return true;
        }

        if (this.state.selectedValue !== nextState.selectedValue) {
            return true;
        }

        return false;
    }
    render() {
        const groupNameRadioGroup = this.getGroupItemNameRadio();
        return (
            <Modal
                closable={false}
                title="添加到"
                mask={false}
                wrapClassName="desk-setting-vertical-center-modal"
                visible={this.props.modalVisible}
                onOk={this.onOkMoveDialog}
                onCancel={this.showModalHidden}
                footer={[
                    <Button
                        key="submit"
                        disabled={this.state.selectedValue === 0}
                        type="primary"
                        onClick={this.onOkMoveDialog}
                    >
                        确定
                    </Button>,
                    <Button key="back" onClick={this.showModalHidden}>
                        取消
                    </Button>
                ]}
            >
                {groupNameRadioGroup}
            </Modal>
        );
    }
}
export default connect(
    state => ({
        groups: state.templateDragData.groups,
        col: state.templateDragData.layout.col
    }),
    {
        updateGroupList
    }
)(MyModal);
