import React, { Component } from "react";
import { DatePicker, Tooltip } from "antd";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/zh_CN";
import "./BusinessDate.less";
class BusinessDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            value: this.props.date
        };
    }
    /**
     * 业务日期切换
     */
    onChange = newDate => {
        newDate = moment(newDate).format("YYYY-MM-DD hh:mm:ss");
        this.setState({
            value: newDate,
            isOpen: true
        });
    };
    /**
     * 取消日期
     */
    handleCancel = () => {
        this.setState({
            isOpen: false,
            value: this.props.date
        });
    };
    /**
     * 确定事件
     */
    handleOk = () => {
        this.props.onOk(moment(this.state.value));
        this.setState({
            isOpen: false
        });
    };
    /**
     * 今天事件
     */
    handleToday = () => {
        this.setState(
            {
                value: moment().format("YYYY-MM-DD hh:mm:ss"),
                isOpen: false
            },
            () => {
                this.props.onOk(moment(this.state.value));
            }
        );
    };
    handleOpenChange = open => {
        this.setState({ isOpen: open });
    };
    handlePanelChange = (value, mode) => {
        console.log(value, mode);

        value = moment(value).format("YYYY-MM-DD hh:mm:ss");
        this.setState({
            value: value,
            isOpen: true
        });
    };
    handleBusinessOpen = () => {
        this.setState({
            isOpen: true
        });
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.date !== this.state.date) {
            this.setState({ value: nextProps.date });
        }
    }
    render() {
        const ExtraFooter = (
            <div className="workbench-ExtraFooter">
                <div className="left">
                    <span className="btn" onClick={this.handleToday}>
                        今天
                    </span>
                </div>
                <div className="right">
                    <span className="btn" onClick={this.handleOk}>
                        确定
                    </span>
                    <span
                        className="btn margin-left-8"
                        onClick={this.handleCancel}
                    >
                        取消
                    </span>
                </div>
            </div>
        );
        let { isOpen, value } = this.state;
        let flag =
            moment(this.state.value).format("YYYY-MM-DD") ===
            moment().format("YYYY-MM-DD");
        let busunessTitle = flag ? "业务日期" : "该业务日期不是今日日期!";
        return (
            <div
                field="business-date"
                fieldname="业务日期"
                className={
                    flag
                        ? "nc-workbench-businessdate"
                        : "nc-workbench-businessdate unbusinessdate"
                }
            >
                <DatePicker
                    dropdownClassName={
                        "field_business-date nc-workbench-businessdate-dropdown"
                    }
                    showToday={false}
                    locale={locale}
                    value={moment(value)}
                    onChange={this.onChange}
                    open={isOpen}
                    renderExtraFooter={() => ExtraFooter}
                    onOpenChange={this.handleOpenChange}
                    onPanelChange={this.handlePanelChange}
                    allowClear={false}
                />
                {!flag ? <span className="business-date-flag">!</span> : ""}
                <Tooltip placement="bottom" title={busunessTitle}>
                    <div
                        className="business-date-block"
                        onClick={this.handleBusinessOpen}
                    />
                </Tooltip>
            </div>
        );
    }
}
export default BusinessDate;
