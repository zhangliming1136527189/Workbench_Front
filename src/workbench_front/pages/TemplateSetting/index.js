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
    setNodeKey
} from 'Store/TemplateSetting/action';
import { Button, Layout, Modal, Tree, Input, Select, Menu, Dropdown, Icon, Tabs } from 'antd';
import { PageLayout, PageLayoutHeader, PageLayoutLeft, PageLayoutRight } from 'Components/PageLayout';
import { createTree } from 'Pub/js/createTree';
import Ajax from 'Pub/js/ajax.js';
import Item from 'antd/lib/list/Item';
import Notice from 'Components/Notice';
import PreviewModal from './showPreview';
import AssignComponent from './assignComponent';
import { openPage } from 'Pub/js/superJump';
import Svg from 'Components/Svg';
import { GetQuery } from 'Pub/js/utils';
import { generateTemData, generateTreeData, generateRoData } from './method';
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
class TemplateSetting extends Component {
    constructor(props) {
        super(props);
        this.urlRequestObj = GetQuery(this.props.location.search);
        console.log(this.urlRequestObj);
        this.state = {
            siderHeight: '280',
            autoExpandParent: true,
            autoExpandTemParent: true,
            treeTemBillData: [], //单据模板数据
            treeTemPrintData: [],
            visible: false,
            alloVisible: false,
            orgidObj: {},
            batchSettingModalVisibel: false, //控制预览摸态框的显隐属性
            isDefaultTem: '',
            previewPrintContent: '',
            previewPrintVisible: false,
            param: this.urlRequestObj
        };
    }
    // 按钮显隐性控制
    setBtnsShow = (item) => {
        let { def1, parentIdcon } = this.props;
        let { code } = item;
        let isShow = false;
        switch (code) {
            case 'edit':
                if (parentIdcon === 'root') {
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
                if (parentIdcon === 'root') {
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
                if (parentIdcon) {
                    isShow = true;
                } else {
                    isShow = false;
                }
                break;
            case 'assign':
                if (parentIdcon === 'root') {
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
                if (parentIdcon) {
                    isShow = true;
                } else {
                    isShow = false;
                }
                break;
            default:
                break;
        }
        return { ...item, isShow };
    };
    //生成按钮方法
    creatBtn = (btnObj) => {
        let { name, isShow, type, code } = btnObj;
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
        let { def1, templatePk, pageCode, appCode, templateNameVal, templateTitleVal } = this.props;
        if (!templateNameVal) {
            Notice({ status: 'warning', msg: '请输入模板名称' });
            return;
        }
        let infoData = {
            pageCode: pageCode,
            templateId: templatePk,
            name: templateNameVal,
            appCode: appCode
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
                    this.props.setSelectedTemKeys([ data.data.id ]);
                    this.props.setParentIdcon(data.data.id);
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
    //设置默认模板 菜单栏
    menuFun = () => {
        let { isDefaultTem } = this.state;
        let isButton = false;
        if (isDefaultTem === 'y') {
            isButton = true;
        }
        return (
            <Menu onClick={this.settingClick.bind(this)}>
                <Menu.Item key='setDefault'>
                    <button disabled={isButton}>设置默认</button>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key='cancelDefault'>
                    <button disabled={!isButton}>取消默认</button>
                </Menu.Item>
            </Menu>
        );
    };
    //设置默认模板方法
    settingClick = (key) => {
        const { templatePk, pageCode, appCode } = this.props;
        let infoDataSet = {
            templateId: templatePk,
            pageCode: pageCode,
            appCode: appCode
        };
        const btnName = key.key;
        if (!templatePk) {
            Notice({ status: 'warning', msg: '请选择模板数据' });
            return;
        }
        let url;
        switch (btnName) {
            case 'setDefault':
                url = '/nccloud/platform/template/setDefaultTemplate.do';
                this.setDefaultFun(url, infoDataSet, '设置默认');
                break;
            case 'cancelDefault':
                url = '/nccloud/platform/template/cancelDefaultTemplate.do';
                this.setDefaultFun(url, infoDataSet, '取消默认');
                break;
            default:
                break;
        }
    };
    //按钮事件的触发
    handleClick = (code) => {
        let { def1, templatePk, pageCode, appCode } = this.props;
        let infoData = {
            templateId: templatePk
        };
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
                        status: 'templateSetting'
                    });
                }
                break;
            case 'delete':
                let url;
                if (def1 === 'menuitem') {
                    url = `/nccloud/platform/template/deletePrintTemplate.do`;
                } else if (def1 === 'apppage') {
                    url = `/nccloud/platform/template/deleteTemplateDetail.do`;
                }
                let _this = this;
                confirm({
                    title: '是否要删除?',
                    content: '',
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '取消',
                    mask: false,
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
    //打印模板预览请求数据方法
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
    /**
     * 设置默认模板的ajax请求
     * @param url 请求路径
     * @param infoData 请求参数
     * @param textInfo 请求成功后的提示信息
     */
    setDefaultFun = (url, infoData, textInfo) => {
        let { def1, parentIdcon } = this.props;
        if (def1 === 'apppage') {
            infoData.templateType = 'bill';
        } else if (def1 === 'menuitem') {
            if (textInfo === '取消默认') {
                if (infoData.pageCode) {
                    delete infoData.pageCode;
                }
                url = `/nccloud/platform/template/cancelDefaultPrintTemplate.do`;
            } else if (textInfo === '设置默认') {
                infoData.parentId = parentIdcon;
                url = `/nccloud/platform/template/setDefaultPrintTemplate.do`;
            }
            if (infoData.templateType) {
                delete infoData.templateType;
            }
        }
        Ajax({
            url: url,
            data: infoData,
            info: {
                name: '模板设置',
                action: '参数查询'
            },
            success: ({ data }) => {
                if (data.success) {
                    Notice({ status: 'success', msg: data.msg });
                    this.reqTreeTemData('setDefault');
                }
            }
        });
    };
    componentDidMount = () => {
        let { param } = this.state;
        // if (param && param.code && param.pageName === 'equiptool') {
        //     this.setState({ searchValue: paramPageCode }, () => {
        //         this.handleSearch(paramPageCode, this.handleExpanded);
        //     });
        // } else {
        //     this.reqTreeData();
        // }
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
            if (searchValue) {
                this.handleSearch(searchValue, this.handleExpanded);
            } else {
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
        //样式处理
        // window.onresize = () => {
        //     //let siderHeight = document.querySelector('.ant-layout-content').offsetHeight;
        //     this.searchAreaHeight=document.querySelector('.ant-input').offsetTop;
        // };
        // this.searchAreaHeight=document.querySelector('.ant-input').offsetTop;
    };
    //右侧树组装数据
    restoreTreeTemData = (templateType, eventType) => {
        let { treeTemBillData, treeTemPrintData } = this.state;
        let { def1, selectedTemKeys, parentIdcon } = this.props;
        let treeData = [];
        let treeInfo;
        let treeTemBillDataArray = this.props.treeTemBillData;
        let treeTemPrintDataArray = this.props.treeTemPrintData;
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
            for (const key in treeObj) {
                if (treeObj.hasOwnProperty(key)) {
                    if (item.templateId === treeObj[key][0].parentId) {
                        item.children.push(treeObj[key][0]);
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
                        this.props.setTemplatePk(treeData[0].pk);
                        this.props.setParentIdcon(treeData[0].parentId);
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
    //加载右侧模板数据
    onSelectQuery = (key, e) => {
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
        let { def1, pageCode, appCode } = this.props;
        let infoData = {
            pageCode: pageCode,
            appCode: appCode
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
        let { def1, parentIdcon } = this.props;
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
            this.props.setTemplatePk(key[0]);
            this.props.setParentIdcon(e.selectedNodes[0].props.refData.parentId);
            this.props.setTemplateNameVal(e.selectedNodes[0].props.refData.name);
            this.props.setTemplateTitleVal(e.selectedNodes[0].props.refData.code);
            this.setState({
                isDefaultTem: e.selectedNodes[0].props.refData.isDefault
            });
        } else {
            this.props.setSelectedTemKeys(key);
            this.props.setTemplatePk('');
            this.props.setParentIdcon('');
            this.props.setTemplateNameVal('');
            this.props.setTemplateTitleVal('');
            this.setState({
                isDefaultTem: ''
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
    //树组件的封装
    treeResAndUser = (data, typeSelect, hideSearch, selectedKeys, expandedKeys, autoExpandParent, classType) => {
        const { searchValue } = this.props;
        const loop = (data) => {
            return data.map((item) => {
                let { code, name, pk } = item;
                if (code === '00') {
                    text = `${name}`;
                }
                let text = `${name} ${code}`;
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
            <div className={classType ? classType : ''}>
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
                            this.onExpand(typeSelect, key, node);
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
    };
    //浏览摸态框显示方法
    showModal = () => {
        this.setState({ previewPrintVisible: true }, () => {
            this.printModalAjax(this.props.templatePk);
        });
    };
    //浏览摸态框隐藏方法
    hideModal = () => {
        this.setState({ previewPrintVisible: false });
    };
    render() {
        const {
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
        let {
            def1,
            expandedKeys,
            selectedKeys,
            selectedTemKeys,
            expandedTemKeys,
            templatePk,
            appCode,
            pageCode,
            parentIdcon,
            templateNameVal,
            templateTitleVal,
            nodeKey
        } = this.props;
        const treeData = [
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
                        <div>模板设置-集团</div>
                        <div className='buttons-component'>
                            {(treeTemBillData.length > 0 || treeTemPrintData.length > 0) &&
                                Btns.map((item, index) => {
                                    item = this.setBtnsShow(item);
                                    return this.creatBtn(item);
                                })}
                            {(treeTemBillData.length > 0 || treeTemPrintData.length > 0) &&
                            parentIdcon &&
                            parentIdcon !== 'root' && (
                                <Dropdown overlay={this.menuFun()} trigger={[ 'click' ]}>
                                    <Button key='' className='margin-left-10' type=''>
                                        设置默认模板
                                    </Button>
                                </Dropdown>
                            )}
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
                        treeData,
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
                        title='请录入正确的模板名称和编码'
                        visible={visible}
                        onOk={this.handleOk}
                        okText={'确认'}
                        cancelText={'取消'}
                        onCancel={this.handleCancel}
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
                            {def1 == 'menuitem' &&
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
                        okText={'确认'}
                        cancelText={'取消'}
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
                    />
                )}
            </PageLayout>
        );
    }
}
TemplateSetting.propTypes = {
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
    setPageCode: PropTypes.func.isRequired,
    setAppCode: PropTypes.func.isRequired,
    setParentIdcon: PropTypes.func.isRequired,
    setNodeKey: PropTypes.func.isRequired,
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
    templateNameVal: PropTypes.string.isRequired,
    templateTitleVal: PropTypes.string.isRequired,
    nodeKey:PropTypes.array.isRequired
};
export default connect(
    (state) => ({
        treeData: state.TemplateSettingData.treeData,
        treeTemBillData: state.TemplateSettingData.treeTemBillData,
        treeTemPrintData: state.TemplateSettingData.treeTemPrintData,
        selectedKeys: state.TemplateSettingData.selectedKeys,
        expandedKeys: state.TemplateSettingData.expandedKeys,
        def1: state.TemplateSettingData.def1,
        selectedTemKeys: state.TemplateSettingData.selectedTemKeys,
        expandedTemKeys: state.TemplateSettingData.expandedTemKeys,
        templatePk: state.TemplateSettingData.templatePk,
        searchValue: state.TemplateSettingData.searchValue,
        pageCode: state.TemplateSettingData.pageCode,
        appCode: state.TemplateSettingData.appCode,
        parentIdcon: state.TemplateSettingData.parentIdcon,
        templateNameVal: state.TemplateSettingData.templateNameVal,
        templateTitleVal: state.TemplateSettingData.templateTitleVal,
        nodeKey: state.TemplateSettingData.nodeKey
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
        setNodeKey
    }
)(TemplateSetting);
