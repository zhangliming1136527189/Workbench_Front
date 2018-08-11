import React, {Component} from "react";
import {high} from "nc-lightapp-front";
const {Refer} = high;
/**
 * 内容语种参照
 * @param {*} props
 */
export default (props = {}) => {
    var conf = {
        refType: "grid",
        refName: "内容语种",
        refCode: "code",
        placeholder: "内容语种",
        queryGridUrl: "/nccloud/platform/appregister/multilangref.do",
        treeConfig: {name: ["编码", "名称"], code: ["refcode", "refname"]},
        isMultiSelectedEnabled: false
    };
    return <Refer {...Object.assign(conf, props)} />;
};
