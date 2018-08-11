import React from 'react';
import { high } from 'nc-lightapp-front';
const {Refer} = high;
/**
 * 元数据主实体和枚举(树表)(600066)
 * @param {*} props 
 */
export default function (props = {}) {
	var conf = {
        queryTreeUrl:'/nccloud/riart/ref/bdmdEntityAndEnumRefTreeAction.do',
        queryGridUrl:'/nccloud/riart/ref/bdmdEntityAndEnumRefTableAction.do',
        columnConfig:[
            {
                name: [ '实体编码', '实体名称'],
                code: [ 'name', 'displayName']
            }
        ],
        refType:"gridTree",
		isMultiSelectedEnabled:true,
		isTreelazyLoad:false
	};

	return <Refer {...Object.assign(conf, props)} />
}
