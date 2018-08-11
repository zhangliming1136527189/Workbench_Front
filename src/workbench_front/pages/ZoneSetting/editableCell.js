import React, { Component } from "react";
import { Input, Select, Checkbox, Button } from "antd";
import _ from "lodash";
const Option = Select.Option;
// 可编辑表格input
export class EditableCell extends React.Component {
    constructor(props) {
        super(props);
    }
    handleChange = e => {
        const value = e.target.value;
        this.props.updateValue(value);
    };
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {},
            thisState = this.state || {};
        if (this.props.value !== nextProps.value) {
            return true;
        }
        return false;
    }
    render() {
        const { value } = this.props;
        return (
            <Input
                size="small"
                style={{ width: 100 }}
                value={value}
                onChange={this.handleChange}
                ref={input => (this[`input`] = input)}
            />
        );
    }
}
// 可编辑一纵列单元格
export class EditAllCell extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            inputValue:''
        }
    }
    handleClick = e => {
        this.props.onChange(this.state.inputValue);
        this.props.hidePopover();
    };
    close = () => {
        this.props.hidePopover();
    };
    changeValue = (e)=>{
        this.setState({inputValue:e.target.value})
    }
    render() {
        return (
            <div className="custom-filter-dropdown">
                <Input value={this.state.inputValue} size="small" ref={`customInput`} onChange={this.changeValue}/>
                <Button type="primary" onClick={this.handleClick}>
                    确定
                </Button>
                <Button onClick={this.close}>取消</Button>
            </div>
        );
    }
}
// 可编辑表格复选框
export class EditableCheck extends React.Component {
    constructor(props) {
        super(props);
    }
    handleChange = e => {
        this.props.onChange(e.target.checked);
    };
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {},
            thisState = this.state || {};
        if (this.props.value !== nextProps.value) {
            return true;
        }
        return false;
    }
    render() {
        const { value } = this.props;
        return (
            <Checkbox checked={Boolean(value)} onChange={this.handleChange} />
        );
    }
}
//批量设置查询区
export class SelectCell extends Component {
    constructor(props) {
        super(props);
    }
    handleSelectChange = value => {
        this.props.onChange(value);
    };
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {},
            thisState = this.state || {};
        if (this.props.selectValue !== nextProps.selectValue) {
            return true;
        }
        return false;
    }
    render() {
        const { selectValue, selectObj, property } = this.props;
        return (
            <Select
                value={
                    _.isEmpty(selectValue) ? selectObj[0].value : selectValue
                }
                onChange={value => {
                    this.handleSelectChange(value);
                }}
                style={{ width: 100 }}
                size={"small"}
            >
                {(() => {
                    if (property === "color") {
                        return selectObj.map((c, index) => {
                            return (
                                <Option key={index} value={c.value}>
                                    <span className="template-setting-color-select">
                                        <span>{c.name}</span>
                                        <span
                                            className="color-select-color"
                                            style={{ backgroundColor: c.value }}
                                        />
                                    </span>
                                </Option>
                            );
                        });
                    } else {
                        return selectObj.map((c, index) => {
                            return (
                                <Option key={index} value={c.value}>
                                    {c.name}
                                </Option>
                            );
                        });
                    }
                })()}
            </Select>
        );
    }
}
