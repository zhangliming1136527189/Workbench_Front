import React, {Component} from "react";
import { high } from 'nc-lightapp-front';
const { Refer } = high;
export default function (props = {}) {
	var conf = {
		refType: 'grid',
		refName: '信用控制域',
		placeholder:"信用控制域",
		refCode: 'uapbd.refer.org.CreditCtlRegionGridRef',
		queryGridUrl: '/nccloud/uapbd/org/CreditCtlRegionGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ '编码', '名称' ],code: [ 'refcode', 'refname' ]}]
	};

	return <Refer {...Object.assign(conf, props)} />
}
