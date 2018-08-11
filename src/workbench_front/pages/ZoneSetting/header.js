import React, { Component } from 'react';
import { Button, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import Ajax from 'Pub/js/ajax';
import Notice from 'Components/Notice';
import { withRouter } from 'react-router-dom';
import PreviewModal from './showPreview';
import { GetQuery } from 'Pub/js/utils';
import { openPage } from 'Pub/js/superJump';
//页面头部
class MyHeader extends Component {
    constructor(props) {
        super(props);
        this.state = { batchSettingModalVisibel: false };
    }
    showModal = () => {
        this.setState({ batchSettingModalVisibel: true });
    };
    setModalVisibel = (visibel) => {
        this.setState({ batchSettingModalVisibel: visibel });
    };
    saveData = () => {
        const { areaList, templetid } = this.props;
        let formPropertyList = [];
        let queryPropertyList = [];
        //将pk_query_property置为空；
        _.forEach(areaList, (a, index) => {
            _.forEach(a.queryPropertyList, (q) => {
                if (q.pk_query_property.indexOf('new') !== -1) {
                    q.pk_query_property = '';
                }
            });
        });

        _.forEach(areaList, (a, index) => {
            if (a.areatype === '0') {
                queryPropertyList = queryPropertyList.concat(a.queryPropertyList);
            } else {
                formPropertyList = formPropertyList.concat(a.queryPropertyList);
            }
        });

        const saveData = {};
        saveData.templetid = templetid;
        saveData.formPropertyList = formPropertyList;
        saveData.queryPropertyList = queryPropertyList;

        Ajax({
            url: `/nccloud/platform/templet/setareaproperty.do`,
            info: {
                name: '单据模板设置',
                action: '保存区域与属性'
            },
            data: saveData,
            success: (res) => {
                let param = GetQuery(this.props.location.search);
                const { data, success } = res.data;
                if (success) {
                    Notice({ status: 'success', msg: data });
                    if (this.props.status) {
                        // 实施态
                        if (this.props.status === 'templateSetting') {
                            openPage(`/TemplateSetting`, false, {}, [ 'status', 'templetid' ]);
                        } else if (this.props.status === 'templateSetting-unit') {
                            openPage(`/TemplateSetting-unit`, false, {}, [ 'status', 'templetid' ]);
                        }
                    } else {
                        // 开发态
                        openPage(`/ZoneSettingComplete`, false, {
                            templetid: this.props.templetid,
                            pcode: param.pcode,
                            pid: param.pid,
                            appcode: param.appcode
                        });
                    }
                } else {
                    Notice({ status: 'error', msg: data });
                }
            }
        });
    };
    render() {
        let { batchSettingModalVisibel } = this.state;
        return (
            <div className='template-setting-header'>
                <div className='header-name'>
                    <span>配置模板区域</span>
                </div>
                <div className='button-list'>
                    <Popconfirm
                        title='确定返回上一个页面吗？'
                        onConfirm={() => {
                            let param = GetQuery(this.props.location.search);
                            if (this.props.status) {
                                // 实施态
                                if (this.props.status === 'templateSetting') {
                                    openPage(`/TemplateSetting`, false, {}, [ 'status', 'templetid' ]);
                                } else if (this.props.status === 'templateSetting-unit') {
                                    openPage(`/TemplateSetting-unit`, false, {}, [ 'status', 'templetid' ]);
                                }
                            } else {
                                // 开发态
                                openPage(
                                    `/Zone`,
                                    false,
                                    {
                                        templetid: this.props.templetid,
                                        pcode: param.pcode,
                                        pid: param.pid,
                                        appcode: param.appcode
                                    },
                                    [ 'appcode', 'pcode', 'pid' ]
                                );
                            }
                        }}
                        placement='top'
                        okText='确定'
                        cancelText='取消'
                    >
                        <Button>上一步</Button>
                    </Popconfirm>

                    <Button onClick={this.saveData}>保存</Button>
                    <Button onClick={this.showModal}>预览</Button>
                    <Popconfirm
                        title='确定取消配置？'
                        onConfirm={() => {
                            if (this.props.status) {
                                // 实施态
                                if (this.props.status === 'templateSetting') {
                                    openPage(`/TemplateSetting`, false, {}, [ 'status', 'templetid' ]);
                                } else if (this.props.status === 'templateSetting-unit') {
                                    openPage(`/TemplateSetting-unit`, false, {}, [ 'status', 'templetid' ]);
                                }
                            } else {
                                //开发态
                                openPage(
                                    `/ar`,
                                    false,
                                    {
                                        b1: '动态建模平台',
                                        b2: '开发配置',
                                        b3: '应用管理',
                                        n: '应用注册',
                                        c: '102202APP'
                                    },
                                    [ 'templetid', 'appcode', 'pcode', 'pid' ]
                                );
                            }
                        }}
                        placement='top'
                        okText='确定'
                        cancelText='取消'
                    >
                        <Button>取消</Button>
                    </Popconfirm>
                </div>
                {batchSettingModalVisibel && (
                    <PreviewModal
                        batchSettingModalVisibel={batchSettingModalVisibel}
                        setModalVisibel={this.setModalVisibel}
                    />
                )}
            </div>
        );
    }
}
export default connect(
    (state) => ({
        areaList: state.zoneSettingData.areaList
    }),
    {}
)(withRouter(MyHeader));
