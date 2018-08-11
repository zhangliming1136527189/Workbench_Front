import React from "react";
import {high} from "nc-lightapp-front";
const {Refer} = high;
/**
 * 元数据实体
 */

export default function(props = {}) {
    var conf = {
        queryTreeUrl: "/nccloud/riart/ref/mdmainEntityRefTreeAction.do",
        refType: "tree",
        isTreelazyLoad: false
    };

    return <Refer {...Object.assign(conf, props)} />;
}
