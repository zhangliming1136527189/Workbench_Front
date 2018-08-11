import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Layout, Modal, Tree, Input, Select, Menu, Dropdown, Icon, Tabs } from 'antd';
import { PageLayout } from 'Components/PageLayout';
import Ajax from 'Pub/js/ajax.js';
import Notice from 'Components/Notice';
import BusinessUnitGroupTreeRef from 'Components/Refers/BusinessUnitGroupTreeRef';
import Svg from 'Components/Svg';
import { generateData, generateTemData, generateTreeData, generateRoData, deepClone } from './method';
const Option = Select.Option;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const initRoTreeData = {
    key: 'abc1234567',
    id: 'abc1234567',
    text: '角色',
    name: '角色',
    code: '1001',
    title: '角色',
    children: []
};
const initUserTreeData = {
    key: 'abc2234567',
    id: 'abc2234567',
    code: '1002',
    text: '用户',
    name: '用户',
    title: '用户',
    children: []
};
const initRoTreeData2 = {
    key: 'abc1234567',
    id: 'abc1234567',
    text: '角色',
    name: '角色',
    code: '1001',
    title: '角色',
    children: []
};
const initUserTreeData2 = {
    key: 'abc2234567',
    id: 'abc2234567',
    code: '1002',
    text: '用户',
    name: '用户',
    title: '用户',
    children: []
};
const initAbiTreeData = {
    key: 'abc3334567',
    id: 'abc3334567',
    text: '职责',
    code: '1003',
    name: '职责',
    title: '职责',
    children: []
};
const initAbiTreeData2 = {
    key: 'abc3334567',
    id: 'abc3334567',
    text: '职责',
    code: '1003',
    name: '职责',
    title: '职责',
    children: []
};
class AssignComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: [ '0' ],
            selectedKeys: [],
            roleSearchValue: '',
            respSearchValue: '',
            autoExpandParent: false,
            nodeKeyValue: '',
            treeRoData: [],
            treeResData: [],
            dataRoObj: {},
            roleUserDatas: {},
            allowDataArray: [],
            treeAllowedData: [],
            allowedTreeKey: '',
            orgidObj: {
                refcode: '',
                refname: window.GETBUSINESSINFO().groupName,
                refpk: window.GETBUSINESSINFO().groupId
            },
            treeRoDataObj: {},
            tabActiveKey: '1'
        };
    }
    componentWillReceiveProps(nextProps) {}
    componentDidMount() {
        let { orgidObj } = this.state;
        if (orgidObj.refpk) {
            this.reqRoTreeData();
        }
    }
    //已分配用户角色和职责的数据请求
    reqAllowTreeData = () => {
        let { orgidObj, nodeKeyValue } = this.state;
        let { templatePk, pageCode, appCode, def1 } = this.props;
        let infoData = {
            pageCode: pageCode,
            orgId: orgidObj.refpk,
            templateId: templatePk,
            appCode: appCode
        };
        if (def1 === 'apppage') {
            infoData.templateType = 'bill';
        } else if (def1 === 'menuitem') {
            infoData.templateType = 'print';
            if (infoData.pageCode) {
                delete infoData.pageCode;
            }
            infoData.pageCode = nodeKeyValue;
        }
        Ajax({
            url: `/nccloud/platform/template/listAssignmentsOfTemplate.do`,
            info: {
                name: '模板设置模块',
                action: '已分配用户和职责'
            },
            data: infoData,
            success: ({ data }) => {
                if (data.success) {
                    this.setState(
                        {
                            allowDataArray: data.data
                        },
                        this.restoreAllowedTree
                    );
                }
            }
        });
    };
    //已分配用户和职责的数据的组装
    restoreAllowedTree = () => {
        let { allowDataArray, treeAllowedData } = this.state;
        allowDataArray.map((item) => {
            item.text = item.name + item.code;
            item.key = item.id;
        });
        treeAllowedData = generateTreeData(allowDataArray);
        this.setState({
            treeAllowedData
        });
    };
    //角色和用户职责的数据请求
    reqRoTreeData = () => {
        let { orgidObj } = this.state;
        if (!orgidObj.refpk) {
            return;
        }
        let infoData = {
            orgId: orgidObj.refpk
        };
        Ajax({
            url: `/nccloud/platform/template/getAllRoleUserAndResp.do`,
            info: {
                name: '应用注册模块',
                action: '角色和用户职责'
            },
            data: infoData,
            success: ({ data }) => {
                if (data.success && data.data) {
                    if (data.data.roles || data.data.users || data.data.resps) {
                        this.restoreRoTreeData(data.data);
                        this.restoreResTreeData(data.data.resps);
                    }
                    this.setState({
                        roleUserDatas: data.data
                    });
                    this.reqAllowTreeData();
                }
            }
        });
    };
    //职责数据组装
    restoreResTreeData = (data) => {
        let { treeResData } = this.state;
        treeResData = [];
        let initResData = initAbiTreeData;
        data.map((item, index) => {
            let { code, id, name } = item;
            item.key = id;
            item.text = name + code;
        });
        initResData.children = data;
        treeResData.push(initResData);
        treeResData = generateTreeData(treeResData);
        this.setState({
            treeResData
        });
    };
    //用户和角色数据的组装
    restoreRoTreeData = (data) => {
        let { treeRoData } = this.state;
        treeRoData = [];
        let initRolesData = initRoTreeData;
        let initUsersData = initUserTreeData;
        data.roles.map((item) => {
            item.type = 'roles';
        });
        data.users.map((item) => {
            item.type = 'users';
        });
        initRolesData.children = generateRoData(data.roles);
        initUsersData.children = generateRoData(data.users);
        treeRoData.push(initRolesData);
        treeRoData.push(initUsersData);
        treeRoData = generateTreeData(treeRoData);
        this.setState({
            treeRoData
        });
    };
    //用户和角色的树点击方法
    selectRoFun = (key, e) => {
        let dataRoObj = {};
        if (key.length > 0) {
            dataRoObj.code = e.selectedNodes[0].props.refData.code;
            dataRoObj.name = e.selectedNodes[0].props.refData.name;
            dataRoObj.id = e.selectedNodes[0].props.refData.id;
            dataRoObj.text = e.selectedNodes[0].props.refData.text;
            this.setState(
                {
                    selectedKeys: key,
                    dataRoObj
                },
                this.lookDataFun
            );
        } else {
            this.setState({
                selectedKeys: key,
                dataRoObj
            });
        }
    };
    //在角色和职责树中找到当前选中树数据
    lookDataFun = () => {
        let { dataRoObj, roleUserDatas } = this.state;
        for (let key in roleUserDatas) {
            roleUserDatas[key].map((item, index) => {
                if (item.id === dataRoObj.id) {
                    if (key === 'users') {
                        dataRoObj.type = 'user';
                    } else if (key === 'roles') {
                        dataRoObj.type = 'role';
                    } else if (key === 'resps') {
                        dataRoObj.type = 'resp';
                    }
                }
            });
        }
        this.setState({
            dataRoObj
        });
    };
    //分配和取消分配方法
    allowClick = (name) => {
        let { dataRoObj, allowDataArray, treeAllowedData, allowedTreeKey } = this.state;
        switch (name) {
            case 'allowRole':
                if (!dataRoObj.id) {
                    Notice({ status: 'warning', msg: '请选中信息' });
                    return;
                }
                const filterData = allowDataArray.find((item) => item.id === dataRoObj.id);
                if (!filterData) {
                    allowDataArray.push(dataRoObj);
                    treeAllowedData = generateTreeData(allowDataArray);
                }
                break;
            case 'allowRoleCancel':
                if (!allowedTreeKey) {
                    Notice({ status: 'warning', msg: '请选中信息' });
                    return;
                }
                Array.prototype.remove = function(val) {
                    let index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                for (let i = 0; i < allowDataArray.length; i++) {
                    if (allowDataArray[i].id === allowedTreeKey) {
                        allowDataArray.remove(allowDataArray[i]);
                    }
                }
                treeAllowedData = generateTreeData(allowDataArray);
                break;
            default:
                break;
        }
        this.setState({
            treeAllowedData,
            allowDataArray
        });
    };
    //已分配树节点的选中方法
    onSelectedAllow = (key, e) => {
        if (key.length > 0) {
            this.setState({
                selectedKeys: key,
                allowedTreeKey: e.selectedNodes[0].props.refData.id
            });
        } else {
            this.setState({
                selectedKeys: key,
                allowedTreeKey: ''
            });
        }
    };
    //树点击事件的集合
    onSelect = (typeSelect, key, e) => {
        switch (typeSelect) {
            case 'resOnselect':
                this.selectRoFun(key, e);
                break;
            case 'allowedOnselect':
                this.onSelectedAllow(key, e);
            default:
                break;
        }
    };
    //树的展开
    onExpand = (expandedKeys) => {
        this.setState({ expandedKeys, autoExpandParent: false });
    };
    //树的搜索
    onSearch = (e) => {
        const value = e.target.value;
        let { treeRoData, tabActiveKey, roleUserDatas, treeResData } = this.state;
        let expandedKeys = [];
        let searchTrees = [];
        let treeRoDataArry = [];
        if (tabActiveKey === '1') {
            if (value) {
                for (let key in roleUserDatas) {
                    if (roleUserDatas.hasOwnProperty(key)) {
                        if (key === 'users' || key === 'roles') {
                            roleUserDatas[key].map((item) => {
                                item.text = item.name + item.code;
                                if (item.text.indexOf(value) > -1) {
                                    expandedKeys.push(item.key);
                                    searchTrees.push(item);
                                }
                            });
                        }
                    }
                }
                searchTrees.map((item) => {
                    item.key = item.id;
                });
                let initRolesData = deepClone(initRoTreeData2);
                let initUsersData = deepClone(initUserTreeData2);
                searchTrees.map((item) => {
                    if (item.type === 'roles') {
                        initRolesData.children.push(item);
                    } else if (item.type === 'users') {
                        initUsersData.children.push(item);
                    }
                });
                treeRoDataArry.push(initRolesData);
                treeRoDataArry.push(initUsersData);
                treeRoDataArry = generateTreeData(treeRoDataArry);
                expandedKeys.push('abc1234567');
                expandedKeys.push('abc2234567');
                this.setState({
                    expandedKeys,
                    roleSearchValue: value,
                    autoExpandParent: true,
                    treeRoData: treeRoDataArry
                });
            } else {
                this.restoreRoTreeData(roleUserDatas);
                this.setState({
                    roleSearchValue: value
                });
            }
        } else if (tabActiveKey === '2') {
            if (value) {
                for (let key in roleUserDatas) {
                    if (roleUserDatas.hasOwnProperty(key)) {
                        if (key === 'resps') {
                            roleUserDatas[key].map((item) => {
                                item.text = item.name + item.code;
                                if (item.text.indexOf(value) > -1) {
                                    expandedKeys.push(item.key);
                                    searchTrees.push(item);
                                }
                            });
                        }
                    }
                }
                let initRolesData = deepClone(initAbiTreeData2);
                initRolesData.children = searchTrees;
                treeRoDataArry.push(initRolesData);
                treeRoDataArry = generateTreeData(treeRoDataArry);
                expandedKeys.push('abc3334567');
                this.setState({
                    expandedKeys,
                    respSearchValue: value,
                    autoExpandParent: false,
                    treeResData: treeRoDataArry
                });
            } else {
                this.restoreResTreeData(roleUserDatas.resps);
                this.setState({
                    respSearchValue: value
                });
            }
        }
    };
    treeResAndUser = (data, typeSelect, hideSearch, searchValue) => {
        const { expandedKeys, autoExpandParent, selectedKeys } = this.state;
        const loop = (data) => {
            return data.map((item) => {
                let { text, key, pk } = item;
                let title;
                if (typeSelect === 'resOnselect') {
                    const index = text.indexOf(searchValue);
                    const beforeStr = text.substr(0, index);
                    const afterStr = text.substr(index + searchValue.length);
                    title =
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
                } else if (typeSelect === 'allowedOnselect') {
                    title = text;
                }
                if (item.children && item.children.length > 0) {
                    return (
                        <TreeNode
                            key={key}
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
                return <TreeNode icon={<span className='tree-dot' />} key={key} title={title} refData={item} />;
            });
        };
        return (
            <div>
                {hideSearch ? (
                    ''
                ) : (
                    <Search
                        style={{ marginBottom: 8 }}
                        placeholder='角色用户或职责查询'
                        onChange={this.onSearch}
                        value={searchValue}
                    />
                )}
                {data.length > 0 && (
                    <Tree
                        showLine
                        showIcon
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        onSelect={this.onSelect.bind(this, typeSelect)}
                        autoExpandParent={autoExpandParent}
                        selectedKeys={selectedKeys}
                    >
                        {loop(data)}
                    </Tree>
                )}
            </div>
        );
    };
    //模态框确定按钮方法
    handleAlloOk = () => {
        let { treeAllowedData, orgidObj, nodeKeyValue } = this.state;
        let { templatePk, appCode, pageCode, def1 } = this.props;
        if (!orgidObj.refpk) {
            Notice({ status: 'warning', msg: '业务单元信息为空' });
            return;
        }
        if (!treeAllowedData) {
            Notice({ status: 'warning', msg: '请选中信息' });
            return;
        }
        let targets = {};
        for (let i = 0; i < treeAllowedData.length; i++) {
            let allowedData = treeAllowedData[i];
            for (let key in allowedData) {
                if (key === 'id') {
                    targets[allowedData[key]] = allowedData.type;
                }
            }
        }
        let newTargets = '';
        for (let key in targets) {
            newTargets = newTargets + `${key}:${targets[key]},`;
        }
        const newTargetsLen = newTargets.length;
        newTargets = newTargets.substr(0, newTargetsLen - 1);
        let infoData = {
            pageCode: pageCode,
            templateId: templatePk,
            orgId: orgidObj.refpk,
            appCode: appCode
        };
        infoData.targets = newTargets;
        if (def1 === 'apppage') {
            infoData.templateType = 'bill';
        } else if (def1 === 'menuitem') {
            infoData.templateType = 'print';
            if (infoData.pageCode) {
                delete infoData.pageCode;
            }
            if (nodeKeyValue) {
                infoData.pageCode = nodeKeyValue;
            }
        }
        Ajax({
            url: `/nccloud/platform/template/assignTemplate.do`,
            data: infoData,
            info: {
                name: '模板设置',
                action: '模板分配保存'
            },
            success: ({ data }) => {
                if (data.success) {
                    Notice({ status: 'success', msg: '分配成功' });
                    this.props.setAssignModalVisible(false);
                }
            }
        });
    };
    //摸态框取消按钮方法
    handleOrlCancel = () => {
        this.props.setAssignModalVisible(false);
    };
    //业务单元参照回调方法
    handdleRefChange = (value) => {
        let { orgidObj } = this.state;
        let { refname, refcode, refpk } = value;
        orgidObj['refname'] = refname;
        orgidObj['refcode'] = refcode;
        orgidObj['refpk'] = refpk;
        this.setState(
            {
                orgidObj
            },
            this.reqRoTreeData
        );
    };
    render() {
        const {
            alloVisible,
            orgidObj,
            treeRoData,
            treeResData,
            allowDataArray,
            treeAllowedData,
            tabActiveKey,
            roleSearchValue,
            respSearchValue
        } = this.state;
        let { templatePk, pageCode, def1, nodeKey } = this.props;
        return (
            <Modal
                closable={false}
                title='多角色和用户模板分配'
                visible={this.props.alloVisible}
                onOk={this.handleAlloOk}
                onCancel={this.handleOrlCancel}
                okText={'确认'}
                cancelText={'取消'}
                width={720}
                keyboard={true}
                bodyStyle={{ padding: '15px' }}
            >
                <div className='allocationPage'>
                    <div className='pageCode-show'>
                        <p className='pageCodeName'>
                            <span>功能节点：</span>
                            <span>{pageCode ? pageCode : ''}</span>
                        </p>
                        {def1 === 'menuitem' && (
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder='节点标识符'
                                optionFilterProp='children'
                                onSelect={(e) => {
                                    this.setState({
                                        nodeKeyValue: e
                                    });
                                }}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {nodeKey &&
                                    nodeKey.length > 0 &&
                                    nodeKey.map((item, index) => {
                                        if (item) {
                                            return <Option value={item}>{item}</Option>;
                                        }
                                    })}
                            </Select>
                        )}
                    </div>
                    <div className='allocationPage-content'>
                        <div className='allocationPage-content-tree'>
                            <div className='allocation-treeCom'>
                                <Tabs
                                    defaultActiveKey='1'
                                    onChange={(tabActiveKey) => {
                                        this.setState({ tabActiveKey });
                                    }}
                                    activeKey={tabActiveKey}
                                >
                                    <TabPane tab='按角色和用户分配' key='1'>
                                        <div className='allocation-treeScrollName'>
                                            {this.treeResAndUser(treeRoData, 'resOnselect', null, roleSearchValue)}
                                        </div>
                                    </TabPane>
                                    <TabPane tab='按职责分配' key='2'>
                                        <div className='allocation-treeScrollResp'>
                                            {this.treeResAndUser(treeResData, 'resOnselect', null, respSearchValue)}
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                            <div className='allocation-button'>
                                <p>
                                    <Button onClick={this.allowClick.bind(this, 'allowRole')}>分配</Button>
                                </p>
                                <p>
                                    <Button onClick={this.allowClick.bind(this, 'allowRoleCancel')}>取消</Button>
                                </p>
                            </div>
                            <div className='allocation-treeContainer'>
                                <div className='allocation-select'>
                                    <BusinessUnitGroupTreeRef
                                        value={orgidObj}
                                        placeholder={'默认业务单元'}
                                        onChange={(value) => {
                                            this.handdleRefChange(value);
                                        }}
                                    />
                                </div>
                                <div className='allocation-tree'>
                                    {treeAllowedData.length > 0 &&
                                        this.treeResAndUser(treeAllowedData, 'allowedOnselect', 'hideSearch')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
AssignComponent.propTypes = {
    templatePk: PropTypes.string.isRequired
};
export default connect(
    (state) => ({
        templatePk: state.TemplateSettingData.templatePk,
        pageCode: state.TemplateSettingData.pageCode,
        appCode: state.TemplateSettingData.appCode,
        def1: state.TemplateSettingData.def1,
        nodeKey: state.TemplateSettingData.nodeKey
    }),
    {}
)(AssignComponent);
