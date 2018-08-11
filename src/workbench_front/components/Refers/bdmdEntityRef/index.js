import React from 'react';
import {high} from "nc-lightapp-front";
const {Refer} = high;
/**
 * 档案元数据实体(600070)
 * @param {*} props
 */
export default function(props = {}) {
    var conf = {
        queryTreeUrl: "/nccloud/riart/ref/bdmdEntityRefTreeAction.do",
        queryGridUrl: "/nccloud/riart/ref/bdmdEntityRefTableAction.do",
        columnConfig: [
            {
                name: ["实体编码", "实体名称"],
                code: ["name", "displayName"]
            }
        ],
        refType: "gridTree",
        isMultiSelectedEnabled: true,
        isTreelazyLoad: false
    };

    return <Refer {...Object.assign(conf, props)} />;
}
