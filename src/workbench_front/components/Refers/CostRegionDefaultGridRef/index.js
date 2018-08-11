import React, {Component} from "react";
import { high } from 'nc-lightapp-front';
const { Refer } = high;
export default function (props = {}) {
	var conf = {
		refType: 'grid',
		refName: '成本域',
		placeholder:'成本域参照',
		refCode: 'uapbd.refer.org.CostRegionDefaultGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/CostRegionDefaultGridRef.do',
		columnConfig: [{name: ['编码', '名称'],code: [ 'refcode', 'refname']}],
		isMultiSelectedEnabled: false,
	};

	return <Refer {...Object.assign(conf, props)} />
}
