import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Modal } from "antd";
import Axios from "axios";
import Notice from "Components/Notice";
import Loading from "Components/Loading";
// import moment from 'moment';
import Gzip from "./gzip";
Axios.defaults.headers.post["Content-Type"] = "application/json";
/**
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {String} method 请求方法 get/post
 * @param {Boolen} switchKey 是否启用压缩
 * @param {Boolen} loading 是否开启loading
 * @param {Object} info 请求描述对象 name - 发起请求的应用名称  action - 发起请求的动作
 * @param {Function} success 请求成功回调
 */
const Ajax = ({
    url,
    data,
    method = "post",
    switchKey = false,
    loading = false,
    info = { name: "", action: "" },
    success = res => {
        console.log(res);
    }
}) => {
    let div;
    let gzipSwitch = sessionStorage.getItem("gzip") - 0;
    let gziptools = new Gzip();
    data = {
        busiParamJson: JSON.stringify(data),
        sysParamJson: {
            busiaction: `${info.name}-${info.action}`,
            ts: Date.parse(new Date())
        }
    };
    /**
     * 请求loading
     */
    if (loading) {
        div = document.createElement("div");
        document.body.appendChild(div);
        ReactDOM.render(<Loading />, div);
    }
    /**
     * 开启报错提示
     */
    let flag = true;
    Axios({
        url,
        data,
        method,
        transformRequest: [
            function(data) {
                // 不压缩
                let gData = JSON.stringify(data);
                // 启动压缩
                if (!switchKey && gzipSwitch) {
                    gData = gziptools.zip(gData);
                }
                return gData;
            }
        ],
        transformResponse: [
            function(data, headers) {
                if (headers.contentpath) {
                    if (headers.redirect === "REDIRECT") {
                        flag = false;
                        SpecialTip(
                            headers.redirectstatus,
                            exitPage,
                            headers.contentpath
                        );
                    } else {
                        exitPage(headers.contentpath);
                    }
                }
                if (headers.environmentmodel) {
                    window.environmentmodel = headers.environmentmodel;
                }
                // 对 data 进行任意转换处理
                let gData;
                // 启动压缩
                if (!switchKey && gzipSwitch) {
                    gData = gziptools.unzip(data);
                } else {
                    gData = JSON.parse(data);
                }
                return gData;
            }
        ]
    })
        .then(res => {
            if (res.status === 200) {
                let {
                    data: { success: successStatus, error: errorStatus }
                } = res;
                if (successStatus) {
                    success(res);
                } else {
                    Notice({ status: "error", msg: errorStatus.message });
                }
                if (loading) {
                    ReactDOM.unmountComponentAtNode(div);
                }
            }
        })
        .catch(error => {
            if (flag) {
                Notice({ status: "error", msg: error.message });
            }
        });
    /**
     * 是否是未压缩的请求
     */
    // if (switchKey) {
    //     Axios({
    //         url,
    //         data,
    //         method,
    //         transformRequest: [
    //             function(data) {
    //                 // 不压缩
    //                 let gData = JSON.stringify(data);
    //                 return gData;
    //             }
    //         ],
    //         transformResponse: [
    //             function(data, headers) {
    //                 if (headers.contentpath) {
    //                     window.location.href = headers.contentpath;
    //                 }
    //                 if (headers.environmentmodel) {
    //                     window.environmentmodel = headers.environmentmodel;
    //                 }
    //                 let gData = JSON.parse(data);
    //                 return gData;
    //             }
    //         ]
    //     })
    //         .then(res => {
    //             if (res.status === 200) {
    //                 let {
    //                     data: { success: successStatus, error: errorStatus }
    //                 } = res;
    //                 if (successStatus) {
    //                     success(res);
    //                 } else {
    //                     Notice({ status: "error", msg: errorStatus.message });
    //                 }
    //                 if (loading) {
    //                     ReactDOM.unmountComponentAtNode(div);
    //                 }
    //             }
    //         })
    //         .catch(error => {
    //             Notice({ status: "error", msg: error.message });
    //         });
    // } else {
    //     Axios({
    //         url,
    //         data,
    //         method,
    //         transformRequest: [
    //             function(data) {
    //                 // 不压缩
    //                 let gData = JSON.stringify(data);
    //                 // 启动压缩
    //                 if (gzipSwitch) {
    //                     gData = gziptools.zip(gData);
    //                 }
    //                 return gData;
    //             }
    //         ],
    //         transformResponse: [
    //             function(data, headers) {
    //                 if (headers.contentpath) {
    //                     window.location.href = headers.contentpath;
    //                 }
    //                 if (headers.environmentmodel) {
    //                     window.environmentmodel = headers.environmentmodel;
    //                 }
    //                 // 对 data 进行任意转换处理
    //                 let gData;
    //                 // 启动压缩
    //                 if (gzipSwitch) {
    //                     gData = gziptools.unzip(data);
    //                 } else {
    //                     gData = JSON.parse(data);
    //                 }
    //                 return gData;
    //             }
    //         ]
    //     })
    //         .then(res => {
    //             if (res.status === 200) {
    //                 let {
    //                     data: { success: successStatus, error: errorStatus }
    //                 } = res;
    //                 if (successStatus) {
    //                     success(res);
    //                 } else {
    //                     Notice({ status: "error", msg: errorStatus.message });
    //                 }
    //                 if (loading) {
    //                     ReactDOM.unmountComponentAtNode(div);
    //                 }
    //             }
    //         })
    //         .catch(error => {
    //             Notice({ status: "error", msg: error.message });
    //         });
    // }
};
/**
 * 强制退出提示
 * @param {Function} callback 回调
 * @param {String} status 状态
 * @param {String} paramData 参数数据
 */
const SpecialTip = (status, callback, paramData) => {
    Modal.warning({
        title: "退出警告！",
        content: switchStatus(status),
        okText: `确定`,
        onOk: () => {
            callback(paramData);
        }
    });
};
/**
 * 状态选择
 */
const switchStatus = status => {
    switch (status) {
        case "0":
            return "用户没有登陆，即将跳转到登陆页面！";
        case "1":
            return "有人强制登陆,您已被踢出系统！";
        case "2":
            return "管理员在系统监视器进行了强制踢出操作！你已被踢出系统!";
    }
};
/**
 * 退出页面
 */
const exitPage = hrefString => {
    window.location.href = hrefString;
};
export default Ajax;
