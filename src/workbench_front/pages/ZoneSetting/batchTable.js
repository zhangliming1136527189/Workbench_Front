import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Input, Button, Icon, Dropdown, Popover, Checkbox } from "antd";
import _ from "lodash";
import { batchSearchData, batchFormData, batchTableData } from "./utilService";
import {
    EditableCell,
    EditableCheck,
    SelectCell,
    EditAllCell
} from "./editableCell";

//批量设置查询区
export default class BatchTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [];
        this.state = {
            visible: false
        };
    }
    //
    handleVisibleChange = (visible, index) => {
        if (visible === false) {
            return;
        }
        this.setState({ [`visible${index}`]: visible });
    };
    //隐藏
    hidePopover = index => {
        this.setState({ [`visible${index}`]: false });
    };
    // 闭包 只对具体的单元格修改
    onCellChange = (index, property) => {
        return value => {
            let { newSource } = this.props;
            newSource = _.cloneDeep(newSource);
            let target = newSource[index];
            if (target) {
                target[property] = value;
                this.props.saveNewSource(newSource);
            }
        };
    };
    // 闭包 一纵列单元格修改
    onAllColCellChange = property => {
        return value => {
            this.saveAllCellValue(value, property);
        };
    };
    //保存一纵列单元格
    saveAllCellValue = (value, property) => {
        let { newSource } = this.props;
        newSource = _.cloneDeep(newSource);
        _.forEach(newSource, n => {
            n[property] = value;
        });
        this.props.saveNewSource(newSource);
    };

    render() {
        let { newSource, areatype } = this.props;
        _.forEach(newSource, (n, i) => {
            n.key = i;
        });
        let columns = [];
        let scrollTableWidth = 500;
        let batchData = [];
        if (areatype === "0") {
            batchData = batchSearchData;
        } else if (areatype === "1") {
            batchData = batchFormData;
        } else {
            batchData = batchTableData;
        }
        _.forEach(batchData, (data, index) => {
            let tmpColData = {
                dataIndex: data.property,
                width: data.width
            };
            scrollTableWidth += data.width;
            ////input的下拉全部批改
            //<Popover
            //     overlayClassName="all-apps-popover"
            //     getPopupContainer={() => {
            //         return document.querySelector(
            //             ".zonesetting-batch-setting-modal"
            //         );
            //     }}
            //     content={
            //         <EditAllCell
            //             property={data.property}
            //             hidePopover={()=>{this.hidePopover(index)}}
            //             onChange={this.onAllColCellChange(
            //                 data.property
            //             )}
            //         />
            //     }
            //     visible={this.state[`visible${index}`]}
            //     onVisibleChange={(visible)=>{this.handleVisibleChange(visible,index)}}
            //     placement="bottomLeft"
            //     trigger="click"
            // >
            //     {data.title} <Icon type="down" />
            // </Popover>
            if (data.type === "checkbox") {
                tmpColData.title = (
                    <Checkbox
                        onChange={e => {
                            this.saveAllCellValue(
                                e.target.checked,
                                data.property
                            );
                        }}
                    >
                        {data.title}
                    </Checkbox>
                );
            } else {
                tmpColData.title = data.title;
            }
            switch (data.type) {
                case "input":
                    tmpColData.render = (text, record, index) => {
                        return (
                            <EditableCell
                                value={text}
                                property={data.property}
                                updateValue={this.onCellChange(
                                    index,
                                    data.property
                                )}
                            />
                        );
                    };
                    break;
                case "checkbox":
                    tmpColData.render = (text, record, index) => {
                        return (
                            <EditableCheck
                                value={text}
                                property={data.property}
                                onChange={this.onCellChange(
                                    index,
                                    data.property
                                )}
                            />
                        );
                    };
                    break;
                case "select":
                    tmpColData.render = (text, record, index) => {
                        return (
                            <SelectCell
                                selectValue={text}
                                property={data.property}
                                selectObj={data.selectObj}
                                onChange={this.onCellChange(
                                    index,
                                    data.property
                                )}
                            />
                        );
                    };
                    break;
            }
            columns.push(tmpColData);
        });
        return (
            <Table
                bordered
                dataSource={newSource}
                columns={columns}
                pagination={false}
                scroll={{ x: scrollTableWidth, y: 400 }}
            />
        );
    }
}
