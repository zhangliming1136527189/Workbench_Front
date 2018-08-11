import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    setTreeData,
    setTreeTemBillData,
    setTreeTemPrintData,
    setExpandedKeys,
    setSelectedKeys,
    setDef1,
    setSelectedTemKeys,
    setExpandedTemKeys,
    setTemplatePk,
    setSearchValue,
    setPageCode,
    setAppCode,
    setParentIdcon,
    setTemplateNameVal,
    setTemplateTitleVal,
    setOrgidObj,
    setNodeKey
} from 'Store/TemplateSetting-unit/action';
import { Button, Layout, Modal, Tree, Input, Select, Menu, Dropdown, Icon, Tabs } from 'antd';
import { PageLayout, PageLayoutHeader, PageLayoutLeft, PageLayoutRight } from 'Components/PageLayout';
import { createTree } from 'Pub/js/createTree';
import Ajax from 'Pub/js/ajax.js';
import Item from 'antd/lib/list/Item';
import Notice from 'Components/Notice';
import BusinessUnitTreeRefUnit from 'Components/Refers/BusinessUnitTreeRefUnit';
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
import PreviewModal from './showPreview';
import AssignComponent from './assignComponent';
import { openPage } from 'Pub/js/superJump';
import Svg from 'Components/Svg';
import { generateData, generateTemData, generateTreeData, generateRoData } from './method';
import './index.less';
const Option = Select.Option;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const { Header, Footer, Sider, Content } = Layout;
const Btns = [
    {
        name: '修改',
        type: '',
        code: 'edit'
    },
    {
        name: '删除',
        type: '',
        code: 'delete'
    },
    {
        name: '复制',
        type: 'primary',
        code: 'copy'
    },
    {
        name: '分配',
        type: '',
        code: 'assign'
    },
    {
        name: '浏览',
        type: '',
        code: 'browse'
    }
];
class TemplateSettingUnit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            siderHeight: '280',
            treeData: [],
            autoExpandParent: true,
            autoExpandTemParent: true,
            treeTemBillData: [], //单据模板数据
            treeTemPrintData: [],
            treePrintTemData: [],
            visible: false,
            alloVisible: false,
            templateType: '',
            previewPrintVisible: false,
            previewPrintContent: '',
            batchSettingModalVisibel: false //控制预览摸态框的显隐属性
        };
    }
    // 按钮显隐性控制
    setBtnsShow = (item) => {
        let { templateType } = this.state;
        const { def1, parentIdcon } = this.props;
        let { code } = item;
        let isShow = false;
        switch (code) {
            case 'edit':
                if (parentIdcon === 'root' || parentIdcon === 'groupRoot' || templateType === 'group') {
                    isShow = false;
                } else {
                    if (parentIdcon) {
                        isShow = true;
                    } else {
                        isShow = false;
                    }
                }
                break;
            case 'delete':
                if (parentIdcon === 'root' || parentIdcon === 'groupRoot' || templateType === 'group') {
                    isShow = false;
                } else {
                    if (parentIdcon) {
                        isShow = true;
                    } else {
                        isShow = false;
                    }
                }
                break;
            case 'copy':
                if (parentIdcon === 'groupRoot') {
                    isShow = false;
                } else {
                    if (parentIdcon) {
                        isShow = true;
                    } else {
                        isShow = false;
                    }
                }
                break;
            case 'assign':
                if (parentIdcon === 'root' || parentIdcon === 'groupRoot' || templateType === 'group') {
                    isShow = false;
                } else {
                    if (parentIdcon) {
                        isShow = true;
                    } else {
                        isShow = false;
                    }
                }
                break;
            case 'browse':
                if (parentIdcon === 'groupRoot') {
                    isShow = false;
                } else {
                    if (parentIdcon) {
                        isShow = true;
                    } else {
                        isShow = false;
                    }
                }
                break;
            default:
                break;
        }
        return { ...item, isShow };
    };
    //生成按钮方法
    creatBtn = (btnObj) => {
        let { isShow, type, code, name } = btnObj;
        if (isShow) {
            return (
                <Button key={name} className='margin-left-6' type={type} onClick={this.handleClick.bind(this, code)}>
                    {name}
                </Button>
            );
        }
    };
    //保存
    handleOk = (e) => {
        const { orgidObj, def1, templatePk, pageCode, appCode, templateNameVal, templateTitleVal } = this.props;
        if (!templateNameVal) {
            Notice({ status: 'warning', msg: '请输入模板标题' });
            return;
        }
        let infoData = {
            pageCode: pageCode,
            templateId: templatePk,
            name: templateNameVal,
            appCode: appCode,
            orgId: orgidObj.refpk
        };
        let url;
        if (def1 === 'apppage') {
            infoData.templateType = 'bill';
            url = `/nccloud/platform/template/copyTemplate.do`;
        } else if (def1 === 'menuitem') {
            if (!templateTitleVal) {
                Notice({ status: 'warning', msg: '请输入模板标题' });
                return;
            }
            infoData.templateType = 'print';
            infoData.templateCode = templateTitleVal;
            url = `/nccloud/platform/template/copyPrintTemplate.do`;
        }
        Ajax({
            url: url,
            data: infoData,
            info: {
                name: '模板设置',
                action: '模板复制'
            },
            success: ({ data }) => {
                if (data.success) {
                    Notice({ status: 'success', msg: '复制成功' });
                    this.props.setSelectedTemKeys([ data.data ]);
                    this.props.setParentIdcon(data.data);
                    this.props.setTemplateNameVal(data.data.name);
                    if (def1 === 'menuitem') {
                        this.props.setTemplateTitleVal(data.data.code);
                    }
                    this.reqTreeTemData('copy');
                    this.setState({
                        visible: false
                    });
                }
            }
        });
    };
    //取消
    handleCancel = (e) => {
        this.setState({
            visible: false
        });
    };
    //按钮事件的触发
    handleClick = (code) => {
        const { def1, templatePk, appCode, pageCode, orgidObj } = this.props;
        let infoData = {
            templateId: templatePk
        };
        if (!orgidObj.refpk) {
            Notice({ status: 'warning', msg: '请选中业务单元' });
            return;
        }
        if (!templatePk) {
            Notice({ status: 'warning', msg: '请选择模板数据' });
            return;
        }
        switch (code) {
            case 'copy':
                this.setState({
                    visible: true
                });
                break;
            case 'edit':
                if (def1 === 'menuitem') {
                    Ajax({
                        loading: true,
                        url: '/nccloud/riart/template/edittemplate.do',
                        data: { appcode: appCode, templateid: templatePk },
                        success: function(res) {
                            if (location.port) {
                                window.open(
                                    'uclient://start/' +
                                        'http://' +
                                        location.hostname +
                                        ':' +
                                        location.port +
                                        res.data.data
                                );
                            } else {
                                window.open('uclient://start/' + 'http://' + location.hostname + res.data.data);
                            }
                        },
                        error: function(res) {
                            alert('lm:' + res.message);
                        }
                    });
                } else {
                    openPage(`ZoneSetting`, false, {
                        templetid: templatePk,
                        status: 'templateSetting-unit'
                    });
                }
                break;
            case 'delete':
                let url;
                let _this = this;
                if (def1 === 'menuitem') {
                    url = `/nccloud/platform/template/deletePrintTemplate.do`;
                } else {
                    url = `/nccloud/platform/template/deleteTemplateDetail.do`;
                }
                confirm({
                    closable: false,
                    title: '是否要删除?',
                    content: '',
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '取消',
                    title: '确认删除这个模板信息吗?',
                    onOk() {
                        Ajax({
                            url: url,
                            data: infoData,
                            info: {
                                name: '模板设置',
                                action: '删除'
                            },
                            success: ({ data }) => {
                                if (data.success) {
                                    Notice({
                                        status: 'success',
                                        msg: '删除成功'
                                    });
                                    _this.reqTreeTemData();
                                }
                            }
                        });
                    },
                    onCancel() {}
                });
                break;
            case 'assign':
                this.setState({
                    alloVisible: true
                });
                break;
            case 'browse':
                if (def1 === 'menuitem') {
                    this.showModal();
                } else {
                    this.setState({
                        batchSettingModalVisibel: true
                    });
                }
                break;
            default:
                break;
        }
    };
    componentDidMount = () => {
        let {
            selectedKeys,
            setSelectedKeys,
            def1,
            treeData,
            expandedKeys,
            setExpandedKeys,
            appCode,
            pageCode,
            setAppCode,
            setPageCode,
            expandedTemKeys,
            setExpandedTemKeys,
            selectedTemKeys,
            setSelectedTemKeys,
            searchValue
        } = this.props;
        if (def1 !== '') {
            if(searchValue){
                this.handleSearch(searchValue, this.handleExpanded);
            }else{
                this.reqTreeData();
            }
            setSelectedKeys(selectedKeys);
            setDef1(def1);
            setExpandedKeys(expandedKeys);
            setAppCode(appCode);
            setPageCode(pageCode);
            this.reqTreeTemData('historyData');
            setExpandedTemKeys(expandedTemKeys);
            setSelectedTemKeys(selectedTemKeys);
        } else {
            this.reqTreeData();
            setSelectedKeys([ '00' ]);
            setDef1('');
        }
        // 样式处理
        // window.onresize = () => {
        // 	let siderHeight = document.querySelector('.ant-layout-content').offsetHeight;
        // 	this.setState({ siderHeight });
        // };
    };
    //右侧树组装数据
    restoreTreeTemData = (templateType, eventType) => {
        let { treeTemBillData, treeTemPrintData } = this.state;
        let { selectedKeys, def1, parentIdcon } = this.props;
        let treeTemBillDataArray = this.props.treeTemBillData;
        let treeTemPrintDataArray = this.props.treeTemPrintData;
        let treeData = [];
        let treeInfo;
        if (templateType === 'bill') {
            treeTemBillDataArray.map((item) => {
                if (item.isDefault === 'y') {
                    item.name = item.name + ' [默认]';
                }
            });
            treeInfo = generateTemData(treeTemBillDataArray);
        } else if (templateType === 'print') {
            treeTemPrintDataArray.map((item) => {
                if (item.isDefault === 'y') {
                    item.name = item.name + ' [默认]';
                }
            });
            treeInfo = generateTemData(treeTemPrintDataArray);
        }
        let { treeArray, treeObj } = treeInfo;
        treeArray.map((item, index) => {
            const groupObj = {
                name: '集团模板',
                title: '集团模板',
                pk: 'qazwsxedc1' + item.pk,
                code: '1001',
                parentId: 'groupRoot',
                children: []
            };
            const orgIdObj = {
                title: '组织模板',
                name: '组织模板',
                pk: 'qazwsxedc2' + item.pk,
                code: '1002',
                parentId: 'groupRoot',
                children: []
            };
            item.children.push(groupObj);
            item.children.push(orgIdObj);
            for (const key in treeObj) {
                if (treeObj.hasOwnProperty(key)) {
                    if (item.templateId === treeObj[key][0].parentId) {
                        if (treeObj[key][0].type === 'group') {
                            item.children[0].children.push(treeObj[key][0]);
                        } else if (treeObj[key][0].type === 'org') {
                            item.children[1].children.push(treeObj[key][0]);
                        }
                    }
                }
            }
        });
        //处理树数据
        treeData = treeInfo.treeArray;
        treeData = generateTreeData(treeData);
        if (templateType === 'bill') {
            if (def1 === 'apppage') {
                if (treeData.length > 0) {
                    if (!eventType) {
                        let newinitKeyArray = [];
                        newinitKeyArray.push(treeData[0].key);
                        this.props.setSelectedTemKeys(newinitKeyArray);
                        this.props.setParentIdcon(treeData[0].parentId);
                        this.props.setTemplatePk(treeData[0].pk);
                        this.props.setTemplateNameVal(treeData[0].name);
                    }
                }
            }
            treeTemBillData = treeData;
            this.setState({
                treeTemBillData
            });
        } else if (templateType === 'print') {
            if (def1 === 'menuitem') {
                if (treeData.length > 0) {
                    if (!eventType) {
                        let newinitKeyArray = [];
                        newinitKeyArray.push(treeData[0].key);
                        this.props.setSelectedTemKeys(newinitKeyArray);
                        this.props.setParentIdcon(treeData[0].parentId);
                        this.props.setTemplatePk(treeData[0].pk);
                        this.props.setTemplateNameVal(treeData[0].name);
                        this.props.setTemplateTitleVal(treeData[0].code);
                    }
                }
            }
            treeTemPrintData = treeData;
            this.setState({
                treeTemPrintData
            });
        }
    };
    onExpand = (typeSelect, expandedKeys) => {
        switch (typeSelect) {
            case 'systemOnselect':
                this.props.setExpandedKeys(expandedKeys);
                this.setState({
                    autoExpandParent: false
                });
                break;
            case 'templateOnselect':
                this.props.setExpandedTemKeys(expandedKeys);
                this.setState({
                    autoExpandTemParent: false
                });
                break;
            default:
                break;
        }
    };
    //加载右侧模板数据
    onSelectQuery = (key, e) => {
        const { orgidObj } = this.props;
        if (!orgidObj.refpk) {
            Notice({ status: 'warning', msg: '请选中业务单元' });
            return;
        }
        if (key.length > 0) {
            this.props.setSelectedKeys(key);
            this.props.setDef1(e.selectedNodes[0].props.refData.def1);
            this.props.setAppCode(e.selectedNodes[0].props.refData.appCode);
            this.props.setPageCode(e.selectedNodes[0].props.refData.code);
            this.setState(
                {
                    autoExpandParent: true
                },
                this.reqTreeTemData
            );
        } else {
            this.props.setSelectedKeys(key);
            this.props.setDef1('');
            this.props.setAppCode('');
            this.props.setPageCode('');
        }
    };
    //请求右侧树数据
    reqTreeTemData = (eventType) => {
        const { pageCode, appCode, def1, orgidObj } = this.props;
        let infoData = {
            pageCode: pageCode,
            appCode: appCode,
            orgId: orgidObj.refpk
        };
        if (!infoData.pageCode) {
            return;
        }
        if (def1 === 'apppage') {
            infoData.templateType = 'bill';
            this.reqTreeTemAjax(infoData, 'bill', eventType);
        } else if (def1 === 'menuitem') {
            if (infoData.pageCode) {
                delete infoData.pageCode;
            }
            infoData.templateType = 'print';
            this.reqTreeTemAjax(infoData, 'print', eventType);
        }
    };
    //请求右侧树数据ajax方法封装
    reqTreeTemAjax = (infoData, templateType, eventType) => {
        Ajax({
            url: `/nccloud/platform/template/getTemplatesOfPage.do`,
            data: infoData,
            info: {
                name: '模板设置',
                action: '参数查询'
            },
            success: ({ data }) => {
                if (data.success) {
                    if (templateType === 'bill') {
                        this.props.setTreeTemBillData(data.data);
                        this.restoreTreeTemData(templateType, eventType);
                    } else if (templateType === 'print') {
                        this.props.setTreeTemPrintData(data.data);
                        this.restoreTreeTemData(templateType, eventType);
                    }
                }
            }
        });
    };
    //单据模板树的onSelect事件
    onTemSelect = (key, e) => {
        const { def1 } = this.props;
        let templateType = '';
        if (def1 === 'apppage') {
            templateType = 'bill';
        } else if (def1 === 'menuitem') {
            templateType = 'print';
            if (key.length > 0) {
                this.props.setNodeKey(e.selectedNodes[0].props.refData.nodeKey);
            }
        }
        if (key.length > 0) {
            this.props.setSelectedTemKeys(key);
            this.props.setTemplatePk(e.selectedNodes[0].props.refData.templateId);
            this.props.setParentIdcon(e.selectedNodes[0].props.refData.parentId);
            this.props.setTemplateNameVal(e.selectedNodes[0].props.refData.name);
            this.props.setTemplateTitleVal(e.selectedNodes[0].props.refData.code);
            this.setState({
                templateType: e.selectedNodes[0].props.refData.type
            });
        } else {
            this.props.setSelectedTemKeys(key);
            this.props.setTemplatePk('');
            this.props.setParentIdcon('');
            this.props.setTemplateNameVal('');
            this.props.setTemplateTitleVal('');
            this.setState({
                templateType: ''
            });
        }
    };
    /**
     * tree 数据请求
     */
    reqTreeData = () => {
        Ajax({
            url: `/nccloud/platform/appregister/querymenuitemstree.do`,
            info: {
                name: '应用注册模块',
                action: '查询'
            },
            success: ({ data }) => {
                if (data.success && data.data.length > 0) {
                    this.props.setTreeData(data.data);
                }
            }
        });
    };
    //树点击事件的汇总
    onSelect = (typeSelect, key, e) => {
        switch (typeSelect) {
            case 'systemOnselect':
                this.onSelectQuery(key, e);
                break;
            case 'templateOnselect':
                this.onTemSelect(key, e);
                break;
            default:
                break;
        }
    };
    //tree的查询方法
    onChange = (e) => {
        const value = e.target.value;
        if (value) {
            this.props.setSearchValue(value);
            this.handleSearch(value, this.handleExpanded);
        } else {
            this.reqTreeData();
            const expandedKeys = [ '00' ];
            this.props.setExpandedKeys(expandedKeys);
            this.props.setSearchValue('');
        }
    };
    handleExpanded = (dataList) => {
        const expandedKeys = dataList.map((item, index) => {
            return item.pk;
        });
        expandedKeys.push('00');
        this.props.setExpandedKeys(expandedKeys);
        this.setState({
            autoExpandParent: true
        });
    };
    handleSearch = (value, callback) => {
        Ajax({
            url: `/nccloud/platform/appregister/searchappmenuitem.do`,
            data: {
                search_content: value,
                containAppPage: true
            },
            info: {
                name: '菜单项',
                action: '查询应用树'
            },
            success: (res) => {
                let { success, data } = res.data;
                if (success && data) {
                    this.props.setTreeData(data);
                    callback(data);
                }
            }
        });
    };
    //树组件的封装
    treeResAndUser = (data, typeSelect, hideSearch, selectedKeys, expandedKeys, autoExpandParent, typeClass) => {
        const { searchValue } = this.props;
        const loop = (data) => {
            return data.map((item) => {
                let { code, name, pk } = item;
                let text = `${name} ${code}`;
                if (code === '00') {
                    text = `${name}`;
                }
                const index = text.indexOf(searchValue);
                const beforeStr = text.substr(0, index);
                const afterStr = text.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span style={{ color: '#f50' }}>{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>
                            <span> {text} </span>
                        </span>
                    );
                if (item.children && item.children.length > 0) {
                    return (
                        <TreeNode
                            key={pk}
                            title={title}
                            refData={item}
                            icon={
                                <Svg
                                    width={15}
                                    height={13}
                                    xlinkHref={
                                        expandedKeys.indexOf(item.pk) === -1 ? (
                                            '#icon-wenjianjia'
                                        ) : (
                                            '#icon-wenjianjiadakai'
                                        )
                                    }
                                />
                            }
                        >
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode icon={<span className='tree-dot' />} key={pk} title={title} refData={item} />;
            });
        };
        return (
            <div className={typeClass ? typeClass : ''}>
                {hideSearch ? (
                    ''
                ) : (
                    <div className='fixed-search-input'>
                        <Search
                            style={{ marginBottom: 8 }}
                            placeholder='菜单查询'
                            onChange={this.onChange}
                            value={searchValue}
                        />
                    </div>
                )}
                {data.length > 0 && (
                    <Tree
                        showLine
                        showIcon
                        onExpand={(key, node) => {
                            this.onExpand(typeSelect, key);
                        }}
                        expandedKeys={expandedKeys}
                        onSelect={(key, node) => {
                            this.onSelect(typeSelect, key, node);
                        }}
                        autoExpandParent={autoExpandParent}
                        selectedKeys={selectedKeys}
                    >
                        {loop(data)}
                    </Tree>
                )}
            </div>
        );
    };
    //预览摸态框显示方法
    setModalVisibel = (visibel) => {
        this.setState({ batchSettingModalVisibel: visibel });
    };
    //分配摸态框显示方法
    setAssignModalVisible = (visibel) => {
        this.setState({ alloVisible: visibel });
        0;
    };
    //参照的回调函数
    handdleRefChange = (value) => {
        let { refname, refcode, refpk } = value;
        let orgidObj = {};
        orgidObj['refname'] = refname;
        orgidObj['refcode'] = refcode;
        orgidObj['refpk'] = refpk;
        this.props.setOrgidObj(orgidObj);
    };
    showModal = () => {
        this.setState({ previewPrintVisible: true }, () => {
            this.printModalAjax(this.props.templatePk);
        });
    };
    hideModal = () => {
        this.setState({ previewPrintVisible: false });
    };
    printModalAjax = (templateId) => {
        let infoData = {};
        infoData.templateId = templateId;
        const url = `/nccloud/platform/template/previewPrintTemplate.do`;
        Ajax({
            url: url,
            data: infoData,
            info: {
                name: '模板设置',
                action: '打印模板预览'
            },
            success: ({ data }) => {
                if (data.success) {
                    document.getElementsByClassName('printContent')[0].innerHTML = data.data;
                }
            }
        });
    };
    render() {
        const {
            treeData,
            treeTemBillData,
            treeTemPrintData,
            visible,
            alloVisible,
            batchSettingModalVisibel,
            autoExpandParent,
            autoExpandTemParent,
            previewPrintContent,
            previewPrintVisible
        } = this.state;
        const {
            selectedKeys,
            expandedKeys,
            def1,
            selectedTemKeys,
            expandedTemKeys,
            templatePk,
            pageCode,
            appCode,
            templateNameVal,
            templateTitleVal,
            orgidObj,
            nodeKey
        } = this.props;
        const leftTreeData = [
            {
                code: '00',
                name: '菜单树',
                pk: '00',
                children: createTree(this.props.treeData, 'code', 'pid')
            }
        ];
        return (
            <PageLayout
                className='nc-workbench-templateSetting'
                header={
                    <PageLayoutHeader>
                        <BusinessUnitTreeRefUnit
                            value={orgidObj}
                            placeholder={'默认业务单元'}
                            onChange={(value) => {
                                this.handdleRefChange(value);
                            }}
                        />
                        <div className='buttons-component'>
                            {(treeTemBillData.length > 0 || treeTemPrintData.length > 0) &&
                                Btns.map((item, index) => {
                                    item = this.setBtnsShow(item);
                                    return this.creatBtn(item);
                                })}
                        </div>
                    </PageLayoutHeader>
                }
            >
                <PageLayoutLeft
                    width={280}
                    height={'100%'}
                    style={{
                        background: '#fff',
                        width: '500px',
                        minHeight: 'calc(100vh - 64px - 48px)',
                        height: `${this.state.siderHeight}px`,
                        overflowY: 'auto',
                        padding: '20px'
                    }}
                >
                    {this.treeResAndUser(
                        leftTreeData,
                        'systemOnselect',
                        null,
                        selectedKeys,
                        expandedKeys,
                        autoExpandParent,
                        'templateSetting-searchTree'
                    )}
                </PageLayoutLeft>
                <PageLayoutRight>
                    {def1 == 'apppage' ? treeTemBillData.length > 0 ? (
                        <div>
                            <p className='template-title'>页面模板</p>
                            {this.treeResAndUser(
                                treeTemBillData,
                                'templateOnselect',
                                'hideSearch',
                                selectedTemKeys,
                                expandedTemKeys,
                                autoExpandTemParent
                            )}
                        </div>
                    ) : (
                        <div className='noPageData'>
                            <p className='noDataTip'>该页面无页面模板</p>
                        </div>
                    ) : def1 == 'menuitem' ? treeTemPrintData.length > 0 ? (
                        <div>
                            <p className='template-title'>打印模板</p>
                            {this.treeResAndUser(
                                treeTemPrintData,
                                'templateOnselect',
                                'hideSearch',
                                selectedTemKeys,
                                expandedTemKeys,
                                autoExpandTemParent
                            )}
                        </div>
                    ) : (
                        <div className='noPrintData'>
                            <p className='noDataTip'>该页面无打印模板</p>
                        </div>
                    ) : (
                        ''
                    )}
                </PageLayoutRight>
                {batchSettingModalVisibel && (
                    <PreviewModal
                        templetid={templatePk}
                        batchSettingModalVisibel={batchSettingModalVisibel}
                        setModalVisibel={this.setModalVisibel}
                    />
                )}
                {visible && (
                    <Modal
                        closable={false}
                        title='请录入正确的模板名称和标题'
                        visible={visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText={'确认'}
                        cancelText={'取消'}
                    >
                        <div className='copyTemplate'>
                            <div>
                                <label htmlFor=''>模板名称：</label>
                                <Input
                                    value={templateNameVal}
                                    style={{ width: '80%' }}
                                    placeholder='请输入名称'
                                    onChange={(e) => {
                                        const templateNameVal = e.target.value;
                                        this.props.setTemplateNameVal(templateNameVal);
                                    }}
                                />
                            </div>
                            {def1 === 'menuitem' &&
                            treeTemPrintData.length > 0 && (
                                <div>
                                    <label htmlFor=''>模板编码：</label>
                                    <Input
                                        style={{ width: '80%' }}
                                        value={templateTitleVal}
                                        placeholder='请输入编码'
                                        onChange={(e) => {
                                            const templateTitleVal = e.target.value;
                                            this.props.setTemplateTitleVal(templateTitleVal);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </Modal>
                )}
                {previewPrintVisible && (
                    <Modal
                        closable={false}
                        title='打印模板预览'
                        visible={previewPrintVisible}
                        onCancel={this.hideModal}
                        footer={null}
                    >
                        <div className='printContent' />
                    </Modal>
                )}
                {alloVisible && (
                    <AssignComponent
                        templatePk={templatePk}
                        alloVisible={alloVisible}
                        setAssignModalVisible={this.setAssignModalVisible}
                        pageCode={pageCode}
                        def1={def1}
                        appCode={appCode}
                        nodeKey={nodeKey}
                        orgidObj={orgidObj}
                    />
                )}
            </PageLayout>
        );
    }
}
TemplateSettingUnit.propTypes = {
    treeData: PropTypes.array.isRequired,
    setTreeData: PropTypes.func.isRequired,
    setExpandedKeys: PropTypes.func.isRequired,
    setSelectedKeys: PropTypes.func.isRequired,
    setDef1: PropTypes.func.isRequired,
    setSelectedTemKeys: PropTypes.func.isRequired,
    setExpandedTemKeys: PropTypes.func.isRequired,
    setTreeTemBillData: PropTypes.func.isRequired,
    setTreeTemPrintData: PropTypes.func.isRequired,
    setTemplatePk: PropTypes.func.isRequired,
    setSearchValue: PropTypes.func.isRequired,
    setTemplateNameVal: PropTypes.func.isRequired,
    setTemplateTitleVal: PropTypes.func.isRequired,
    setPageCode: PropTypes.func.isRequired,
    setAppCode: PropTypes.func.isRequired,
    setParentIdcon: PropTypes.func.isRequired,
    setOrgidObj: PropTypes.func.isRequired,
    selectedKeys: PropTypes.array.isRequired,
    expandedKeys: PropTypes.array.isRequired,
    treeTemBillData: PropTypes.array.isRequired,
    treeTemPrintData: PropTypes.array.isRequired,
    def1: PropTypes.string.isRequired,
    selectedTemKeys: PropTypes.array.isRequired,
    expandedTemKeys: PropTypes.array.isRequired,
    templatePk: PropTypes.string.isRequired,
    searchValue: PropTypes.string.isRequired,
    pageCode: PropTypes.string.isRequired,
    appCode: PropTypes.string.isRequired,
    parentIdcon: PropTypes.string.isRequired,
    templateTitleVal: PropTypes.string.isRequired,
    templateNameVal: PropTypes.string.isRequired,
    orgidObj:PropTypes.object.isRequired,
    nodeKey:PropTypes.array.isRequired
};
export default connect(
    (state) => ({
        treeData: state.TemplateSettingUnitData.treeData,
        treeTemBillData: state.TemplateSettingUnitData.treeTemBillData,
        treeTemPrintData: state.TemplateSettingUnitData.treeTemPrintData,
        selectedKeys: state.TemplateSettingUnitData.selectedKeys,
        expandedKeys: state.TemplateSettingUnitData.expandedKeys,
        def1: state.TemplateSettingUnitData.def1,
        selectedTemKeys: state.TemplateSettingUnitData.selectedTemKeys,
        expandedTemKeys: state.TemplateSettingUnitData.expandedTemKeys,
        templatePk: state.TemplateSettingUnitData.templatePk,
        searchValue: state.TemplateSettingUnitData.searchValue,
        pageCode: state.TemplateSettingUnitData.pageCode,
        appCode: state.TemplateSettingUnitData.appCode,
        parentIdcon: state.TemplateSettingUnitData.parentIdcon,
        TemplateNameVal: state.TemplateSettingUnitData.TemplateNameVal,
        TemplateTitleVal: state.TemplateSettingUnitData.TemplateTitleVal,
        orgidObj: state.TemplateSettingUnitData.orgidObj,
        nodeKey: state.TemplateSettingUnitData.nodeKey
    }),
    {
        setTreeData,
        setTreeTemBillData,
        setTreeTemPrintData,
        setExpandedKeys,
        setSelectedKeys,
        setDef1,
        setSelectedTemKeys,
        setExpandedTemKeys,
        setTemplatePk,
        setSearchValue,
        setPageCode,
        setAppCode,
        setParentIdcon,
        setTemplateNameVal,
        setTemplateTitleVal,
        setOrgidObj,
        setNodeKey
    }
)(TemplateSettingUnit);
