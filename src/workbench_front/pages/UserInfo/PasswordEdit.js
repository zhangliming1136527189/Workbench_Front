import React, { Component } from "react";
import { Form, Input } from "antd";
import Ajax from "Pub/js/ajax";
const FormItem = Form.Item;
class PasswordEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validate: true,
            confirmDirty: false,
            msg: ""
        };
    }
    handlePwCheck = e => {
        const value = e.target.value;
        if (value === "") {
            this.setState({ validate: false });
            return;
        }
        Ajax({
            url: `/nccloud/platform/appregister/checkuserpwd.do`,
            info: {
                name: "账户设置",
                action: "密码校验"
            },
            data: {
                oldPassword: value
            },
            success: ({ data: { data } }) => {
                if (data) {
                    this.setState({ validate: data.status, msg: data.msg });
                }
            }
        });
    };
    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    validateToNextNewPassword = (rule, value, callback) => {
        if (value === "") {
            callback();
        }
        if (!this.state.validate) {
            callback(this.state.msg);
        }
        const form = this.props.formObj;
        if (value && this.state.confirmDirty) {
            form.validateFields(["newpw"], { force: true });
        }
        callback();
    };
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.formObj;
        if (value && value === form.getFieldValue("pw")) {
            callback("新密码不能与原始密码相同!");
        }
        if (value && this.state.confirmDirty) {
            form.validateFields(["confirmpw"], { force: true });
        }
        callback();
    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.formObj;
        if (value && value !== form.getFieldValue("newpw")) {
            callback("两次密码输入不一致，请重试");
        } else {
            callback();
        }
    };
    componentWillReceiveProps(nextProps){
        this.setState({ confirmDirty: false });
    }
    render() {
        let { layout, formObj } = this.props;
        let { getFieldDecorator } = formObj;
        return (
            <Form>
                <FormItem className="userinfo-item" {...layout} label="旧密码">
                    {getFieldDecorator("pw", {
                        rules: [
                            {
                                required: true,
                                message: "请输入原始密码！"
                            },
                            {
                                validator: this.validateToNextNewPassword
                            }
                        ]
                    })(<Input onBlur={this.handlePwCheck} type="password" />)}
                </FormItem>
                <FormItem className="userinfo-item" {...layout} label="新密码">
                    {getFieldDecorator("newpw", {
                        rules: [
                            {
                                required: true,
                                message: "请输入新密码！"
                            },
                            {
                                validator: this.validateToNextPassword
                            }
                        ]
                    })(<Input type="password" />)}
                </FormItem>
                <FormItem
                    className="userinfo-item"
                    {...layout}
                    label="确认密码"
                >
                    {getFieldDecorator("confirmpw", {
                        rules: [
                            {
                                required: true,
                                message: "请再次确认新密码！"
                            },
                            {
                                validator: this.compareToFirstPassword
                            }
                        ]
                    })(
                        <Input
                            type="password"
                            onBlur={this.handleConfirmBlur}
                        />
                    )}
                </FormItem>
            </Form>
        );
    }
}
export default PasswordEdit;
