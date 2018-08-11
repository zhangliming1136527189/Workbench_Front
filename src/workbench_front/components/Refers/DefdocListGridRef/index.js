import React from "react";
import {high} from "nc-lightapp-front";

const {Refer} = high;
/**
 * 自定义档案 - 表
 */
export default function(props = {}) {
    var conf = {
        refType: "grid",
        refName: "自定义档案定义(表)",
        placeholder: "自定义档案定义(表)",
        refCode: "uapbd.refer.userdef.DefdocListGridRef",
        queryGridUrl: "/nccloud/uapbd/userdef/DefdocListGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {name: ["自定义档案编码", "自定义档案名称"], code: ["code", "name"]}
        ]
    };

    return <Refer {...Object.assign(conf, props)} />;
}
