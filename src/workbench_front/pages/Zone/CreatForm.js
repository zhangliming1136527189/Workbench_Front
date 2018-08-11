import { Col, Form, Input, Select } from 'antd';
import React from 'react';
const FormItem = Form.Item;
import Notice from 'Components/Notice';
/**
 * 创建表单
 * @param {*} propsData 
 * @param {*} DOMDATA 
 * @param {*} nodeData 
 */
export const createForm = (DOMDATA, propsData) => {
    const children = [];
    DOMDATA &&
        DOMDATA.map((item, index) => {
            let { lable, md = 24, lg = 12, xl = 8 } = item;
            children.push(
                <Col md={md} lg={lg} xl={xl} key={index}>
                    {createFormItem(propsData, item)}
                </Col>
            );
        });

    return children.filter((item) => {
        return item.props.children;
    });
};
/**
 * 创建表单
 * @param {*} props 
 * @param {*} itemInfo 
 */
const createFormItem = (props, itemInfo) => {
    let nodeData = props.zoneDatas;
    const { getFieldDecorator } = props.form;
    let { lable, type, code, required, check, search } = itemInfo;
    switch (type) {
        case 'select': 
            if(nodeData.areaList&&nodeData.areaList.length>0){
                nodeData.areaList.map((item)=>{
                    if((nodeData[code]===item.code)&&(item.areatype==='0')){
                        Notice({ status: 'error', msg: '数据有误' });
                        return ;
                    }
                })
            }
            return (
                <FormItem label={lable}>
                    {getFieldDecorator(code, {
                        initialValue: nodeData[code] ? nodeData[code] + '' : '',
                        rules: [
                            {
                                required: required,
                                message: '此字段为必输项或请补充此表单区编码！'
                            }
                        ]
                    })(<Select>{itemInfo.options}</Select>)}
                </FormItem>
            );
            break;
        default:
            return (
                <FormItem label={lable}>
                    {getFieldDecorator(code, {
                        initialValue: nodeData[code] ? nodeData[code] + '' : '',
                        rules: [
                            {
                                required: required,
                                message: `请输入${lable}`
                            },
                            {
                                validator: check ? check : null
                            }
                        ]
                    })(<Input placeholder={`请输入${lable}`} />)}
                </FormItem>
            );
            break;
    }
};
