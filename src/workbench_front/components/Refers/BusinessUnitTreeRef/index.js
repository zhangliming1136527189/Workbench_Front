import React from "react";
import { high } from "nc-lightapp-front";
const { Refer } = high;
/**
 * 业务单元参照
 * @param {*} props
 */
export default function(props = {}) {
    var conf = {
        refType: "tree",
        refName: "业务单元",
        refCode: "uapbd.refer.org.BusinessUnitTreeRef",
        rootNode: { refname: "业务单元", refpk: "root" },
        placeholder: "业务单元",
        queryTreeUrl: "/nccloud/uapbd/ref/businessunit.do",
        treeConfig: { name: ["编码", "名称"], code: ["refcode", "refname"] },
        isMultiSelectedEnabled: false,
        queryCondition: () => {
            return {
                TreeRefActionExt:
                    "nccloud.web.platform.workbench.ref.filter.OrgRefPermissionFilter"
            };
        },
        unitProps: {
            queryTreeUrl: "/nccloud/riart/ref/groupRefTreeAction.do",
            refType: "tree",
            //isMultiSelectedEnabled:true
            refName: "集团",
            rootNode: { refname: "集团", refpk: "root" }
        },
        isShowUnit: false
    };
    return <Refer {...Object.assign(conf, props)} />;
}
