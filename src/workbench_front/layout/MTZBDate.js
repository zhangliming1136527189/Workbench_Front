import { Component } from "react";
import { base } from "nc-lightapp-front";
import moment from "moment";
import { Tooltip } from "antd";
const NCTZDatePickClientTime = base.NCTZDatePickClientTime;
const format = "YYYY-MM-DD";
const dateInputPlaceholder = "选择日期";
class MTZBDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            value: ""
        };
    }
    onChange = d => {
        this.setState({
            value: moment(d).format(format),
            isOpen: true
        });
    };
    onSelect = d => {
        console.log(d);
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
    handlePanelChange = (value, mode) => {
        console.log(value, mode);

        value = moment(value).format("YYYY-MM-DD hh:mm:ss");
        this.setState({
            value: value,
            isOpen: true
        });
    };
    handleOpenChange = open => {
        this.setState({ isOpen: open });
    };
    handleBusinessOpen = () => {
        this.setState({
            isOpen: true
        });
    };
    render() {
        console.log(this.state.value);
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
                <NCTZDatePickClientTime
                    dropdownClassName={
                        "field_business-date nc-workbench-businessdate-dropdown"
                    }
                    format={format}
                    open={isOpen}
                    onSelect={this.onSelect}
                    onChange={this.onChange}
                    value={this.state.value}
                    placeholder={dateInputPlaceholder}
                    showToday={false}
                    renderFooter={() => ExtraFooter}
                    onOpenChange={this.handleOpenChange}
                    onPanelChange={this.handlePanelChange}
                    autofocus={false}
                    showClear={false}
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
export default MTZBDate;
