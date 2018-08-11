import React, { Component } from "react";
import { Icon } from "antd";
import { withRouter } from "react-router-dom";
import { GetQuery } from "Pub/js/utils";
import { openPage } from "Pub/js/superJump";
class MyContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="template-setting-content">
        <div className="content">
          <Icon className="complete-icon" type="check-circle" />

          <div>
            <p className="first-text">应用页面配置完成</p>
            <a
              onClick={() => {
                let param = GetQuery(this.props.location.search);
                openPage(
                  `/Zone`,
                  false,
                  {
                    pcode: param.pcode,
                    pid: param.pid,
                    appcode: param.appcode
                  },['templetid']
                );
              }}
            >
              继续新增模板
            </a>
            <a
              onClick={() => {
                openPage(`/ar`, false, {
                  c: "102202APP",
                  b1: "动态建模平台",
                  b2: "开发配置",
                  b3: "应用管理",
                  n: "应用注册"
                },['templetid','pcode','pid','appcode']);
              }}
            >
              返回页面配置
            </a>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(MyContent);
