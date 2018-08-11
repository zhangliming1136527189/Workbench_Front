import React, { Component } from "react";
import { Form, Input, Button, Row, Col } from "antd";
const FormItem = Form.Item;
class EmailEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prompt: false,
            num: 0
        };
    }
    /**
     * 获取验证码
     */
    handleGetCaptcha = () => {
        if (this.state.num > 0) {
            return;
        }
        this.setState(
            {
                prompt: true,
                num: 60
            },
            this.captchaCount
        );
    };
    /**
     * 验证码计数
     */
    captchaCount = () => {
        let fun = () => {
            let num = this.state.num;
            if (num === 0) {
                this.setState({ prompt: false });
                clearInterval(timer);
            } else {
                num--;
            }
            this.setState({ num });
        };
        let timer = setInterval(fun, 1000);
    };
    render() {
        let { layout, formObj } = this.props;
        let { getFieldDecorator } = formObj;
        return (
            <Form>
                <FormItem className="userinfo-item" {...layout} label="密码">
                    {getFieldDecorator("pw", {
                        rules: [
                            {
                                required: true,
                                message: "请输入密码！"
                            }
                        ]
                    })(<Input type="password" />)}
                </FormItem>
                <FormItem {...layout} label="E-mail">
                    {getFieldDecorator("email", {
                        rules: [
                            {
                                type: "email",
                                message: "输入不是有效的电子邮箱！"
                            },
                            {
                                required: true,
                                message: "请输入电子邮箱!"
                            }
                        ]
                    })(<Input />)}
                </FormItem>
                <FormItem
                    {...layout}
                    label="验证码"
                    extra={
                        this.state.prompt
                            ? "验证码已发送至您的电子邮箱，请注意查收！"
                            : ""
                    }
                >
                    <Row gutter={8}>
                        <Col span={12}>
                            {getFieldDecorator("captcha", {
                                rules: [
                                    { required: true, message: "请输入验证码!" }
                                ]
                            })(<Input />)}
                        </Col>
                        <Col span={12}>
                            <Button onClick={this.handleGetCaptcha}>
                                获取验证码{this.state.num > 0
                                    ? `(${this.state.num})`
                                    : ""}
                            </Button>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
        );
    }
}
export default EmailEdit;
