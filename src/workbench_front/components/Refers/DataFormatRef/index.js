import React, {Component} from "react";
import {high} from "nc-lightapp-front";
const {Refer} = high;
/**
 * 业务数据格式参照
 * @param {*} props
 */
export default (props = {}) => {
    var conf = {
        refType: "grid",
        refName: "数据格式",
        refCode: "code",
        placeholder: "数据格式",
        queryGridUrl: "/nccloud/platform/appregister/dataformatref.do",
        treeConfig: {name: ["编码", "名称"], code: ["refcode", "refname"]},
        isMultiSelectedEnabled: false
    };
    return <Refer {...Object.assign(conf, props)} />;
};
