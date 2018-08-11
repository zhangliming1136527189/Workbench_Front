import React, {Component} from "react";
import { high } from 'nc-lightapp-front';
const { Refer } = high;
/**
 * 业务单元参照+集团
 * @param {*} props 
 */
export default function (props={}) {
    var conf = {
        refType: 'tree',
        refName: '业务单元',//'uapbd.refer.org.BusinessUnitTreeRef'
        refCode: 'uapbd.org.BusinessUnitTreeRef',//uapbd.org.BusinessUnitAndGroupTreeRef
        rootNode:{refname:'业务单元',refpk:'root'},
        placeholder:"业务单元",
        queryTreeUrl: '/nccloud/uapbd/ref/businessunit.do',//BusinessUnitTreeRef.do
        treeConfig:{name:['编码', '名称'],code: ['refcode', 'refname']},//	uapbd/refer/org/BusinessUnitAndGroupTreeRef/index	
        isMultiSelectedEnabled: false
    };
    return <Refer {...Object.assign(conf, props)} />
}
