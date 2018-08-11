import React from "react";
import { notification } from "antd";
import Svg from "Components/Svg";
import "./index.less";
const Notice = ({ status, msg = "操作成功", duration = 4.5 }) => {
    let Obj = {};
    notification.config({
        placement: "topRight",
        top: 150
    });
    switch (status) {
        case "success":
            Obj = {
                icon: (
                    <Svg width={25} height={25} xlinkHref={"#icon-wancheng"} />
                ),
                className: "nc-notification success",
                message: "已成功！",
                description: msg,
                duration: duration,
                style: {
                    color: "#67C23A"
                }
            };
            break;
        case "warning":
            Obj = {
                icon: <Svg width={25} height={25} xlinkHref={"#icon-zhuyi1"} />,
                className: "nc-notification warning",
                message: "请注意！",
                description: msg,
                duration: duration,
                style: {
                    color: "#FF8B00"
                }
            };
            break;
        case "error":
            Obj = {
                icon: <Svg width={25} height={25} xlinkHref={"#icon-shibai"} />,
                className: "nc-notification error",
                message: "出错了！",
                description: msg,
                duration: duration,
                style: {
                    color: "#F56C6C"
                }
            };
            break;
        default:
            break;
    }
    notification.open({ ...Obj });
};

export default Notice;
