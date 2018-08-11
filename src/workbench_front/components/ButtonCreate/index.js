import React, {Component} from "react";
import {Button} from "antd";
/**
 * datasource - 按钮描述 数据源
 * {
        code:'addAppClass', - 按钮编码
        name: "增加应用分类", - 按钮名称
        type: "primary", - 按钮类型
        isshow:true - 是否显示
    },
 * onClick - 按钮 Click 事件
 */
class CreateButton extends Component {
    constructor(props) {
        super(props);
    }
    creatBtn = (dataSource) => {
        return dataSource.map((item, index) => {
            if (item.isshow) {
                return (
                    <Button
                        className={`margin-left-6 ${
                            item.className ? item.className : ""
                        }`}
                        key={item.code}
                        type={item.type}
                        onClick={() => {
                            this.props.onClick(item.code);
                        }}>
                        {item.name}
                    </Button>
                );
            } else {
                return null;
            }
        });
    };
    render() {
        return (
            <div
                className={`buttons-component ${
                    this.props.className ? this.props.className : ""
                }`}>
                {this.creatBtn(this.props.dataSource)}
            </div>
        );
    }
}
export default CreateButton;
