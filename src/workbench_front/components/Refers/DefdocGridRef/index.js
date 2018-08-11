import React from "react";
import {high} from "nc-lightapp-front";

const {Refer} = high;
/**
 * 自定义档案
 * @param {*} props 
 */
export default function(props = {}) {
    var conf = {
        refType: "grid",
        refName: "自定义档案(表)",
        placeholder: "自定义档案(表)",
        refCode: "uapbd.refer.userdef.DefdocGridRef",
        queryGridUrl: "/nccloud/uapbd/userdef/DefdocGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [{name: ["编码", "名称"], code: ["code", "name"]}]
    };

    return <Refer {...Object.assign(conf, props)} />;
}
