import React, { Component } from "react";
import { base, high, ajax, toast } from "nc-lightapp-front";

const { PopRefer } = high.Refer, // 引入PopRefer类
    {
        NCRadio: Radio,
        NCTree,
        NCMenu,
        NCDropdown,
        NCButton,
        NCFormControl
    } = base,
    { NCRadioGroup: RadioGroup } = Radio;
const TreeNode = NCTree.NCTreeNode;

class ReferTree extends Component {
    static defaultProps = {
        defaultExpandAll: false
    };

    constructor(props) {
        super(props);
        this.state = {
            datas: []
        };
    }
    componentWillMount() {
        this.state.datas = this.props.data;
        this.setState(this.state);
    }

    componentWillReceiveProps(nextProps) {
        this.state.datas = nextProps.data;
        this.setState(this.state);
    }
    render() {
        var renderTitle = item => {
            return item.refpk == "root"
                ? item.refname
                : item.nodeData.nodecode + " " + item.nodeData.nodetitle;
        };
        const { data, ...otherProps } = this.props;
        const loop = datas =>
            datas.map(item => {
                var children = item.children || [];
                debugger;
                return (
                    <NCTree.NCTreeNode
                        title={renderTitle(item)}
                        key={item.refpk}
                        isLeaf={children.length == 0}
                        treeNodeData={item.nodeData || {}}
                        nodeData={item.nodeData || {}}
                    >
                        {loop(children)}
                    </NCTree.NCTreeNode>
                );
            });
        return <NCTree {...otherProps}>{loop(this.state.datas)}</NCTree>;
    }
}

class Ref extends PopRefer {
    // 继承PopRefer类
    constructor(props) {
        super(props);
        this.state = {
            ...this.state, // 继承state
            treetype: "type"
        };
    }

    onTreeTypeChange = value => {
        this.state.treetype = value;
        this.setState(this.state, () => {
            this.loadTreeData(this.getParam()).then(data => {
                var rootTitle = value === "type" ? "账簿类型" : "主账簿";
                var root = {
                    refname: rootTitle,
                    refpk: "root"
                };
                this.setTreeData("treeData", root, data);
            });
        });
    };
    getParam = (param = {}) => {
        var { queryCondition } = this.props,
            queryCondition = queryCondition
                ? typeof queryCondition === "function"
                    ? queryCondition()
                    : typeof queryCondition === "object"
                        ? queryCondition
                        : {}
                : {};
        return {
            disabledDataShow: false,
            queryCondition: {
                ...queryCondition,
                treetype: this.state.treetype,
                textValue: this.state.textValue
            },
            pageInfo: { pageSize: 10, pageIndex: 1 } //放置报错
        };
    };

    loadTreeData = async param => {
        return await new Promise(resolve => {
            this.setState({ loading: true }, () => {
                let { currentLevel, referVal } = this.state;
                let { queryTreeUrl, queryCondition, isCacheable } = this.props;
                ajax({
                    url: queryTreeUrl,
                    data: param,
                    loading: false,
                    success: res => {
                        this.setState({ loading: false }, () => {
                            if (!res.success) {
                                throw new Error(res.error.message);
                                return;
                            }
                            res.data.datarows.forEach(e => {
                                e.nodeData.refpk = e.nodeData.nodeid;
                                e.nodeData.refname = e.nodeData.nodetitle;
                            });
                            var newData = {
                                //满足平台的格式
                                rows: res.data.datarows
                            };
                            resolve(newData);
                        });
                    },
                    error: e => {
                        toast({ color: "danger", content: e.message });
                        this.setState({
                            loading: false
                        });
                        throw new Error(e);
                    }
                });
            });
        });
    };

    onTreeNodeSelectWapper(
        selectedKeys,
        { selected, selectedNodes, node, event },
        ...rest
    ) {
        if (
            this.state.treetype == "table" &&
            node.props.treeNodeData.pid == "root"
        )
            return;
        this.onTreeNodeSelect(
            selectedKeys,
            { selected, selectedNodes, node, event },
            ...rest
        );
    }
    z;

    onTreeNodeCheckWapper(checkedKeys, { checked, checkedNodes, node, event }) {
        if (
            this.state.treetype == "table" &&
            node.props.treeNodeData.pid == "root"
        )
            return;
        this.onTreeNodeCheckWapper(checkedKeys, {
            checked,
            checkedNodes,
            node,
            event
        });
    }
    setTreeData = (target, parentNode, data, cb) => {
        let { expandedKeys } = this.state;
        data.rows.forEach(e => {
            e._display = e.title;
            e.pid = e.pid || rootNode.refpk;
        });
        this.setState(
            {
                //[target]: this.state[target],
                [target]: data.rows || [],
                expandedKeys: []
            },
            () => {
                typeof cb === "function" && cb();
            }
        );
    };

    // 复写原型方法：渲染弹出层左侧
    renderPopoverLeft = () => {
        let {
            isSearch,
            selectedKeys,
            expandedKeys,
            selectedValues,
            treeData
        } = this.state;
        const {
            refType,
            isMultiSelectedEnabled,
            isTreelazyLoad,
            rootNode,
            onlyLeafCanSelect
        } = this.props;

        //树表state
        var loopNode = (nodes, handler) => {
            nodes.forEach(node => {
                handler && handler(node, node.children || []);
                loopNode(node.children || [], handler);
            });
        };

        var laybtns = [],
            createNumberBtns = nodes => {
                //获取树节点层级号数组
                var maxlaynumber = 1,
                    i,
                    btns = [],
                    hander = (node, children) => {
                        var nodenumber = parseInt(
                            node.nodeData ? node.nodeData.laynumber : 0
                        );
                        maxlaynumber =
                            nodenumber <= maxlaynumber
                                ? maxlaynumber
                                : nodenumber;
                    };
                loopNode(nodes, hander);
                for (i = 0; i <= maxlaynumber; i++) {
                    laybtns.push(
                        <NCMenu.Item key={i} expandLay={true}>
                            {i}层
                        </NCMenu.Item>
                    );
                }
            };
        createNumberBtns(treeData || []);

        var onMenuSelect = (domEvent, item, key) => {
            if (domEvent.key == "expandAll") {
                var key = [],
                    keyHander = (node, children) => {
                        key.push(node.key);
                    };
                loopNode(treeData, keyHander);
                this.state.expandedKeys = key;
                this.setState(this.state);
            }
            if (domEvent.key == "unexpandAll") {
                this.state.expandedKeys = [];
                this.setState(this.state);
            }
            if (domEvent.item.props.expandLay) {
                var key = [],
                    layno = domEvent.key,
                    keyHander = (node, children) => {
                        var nodenumber = parseInt(
                            node.nodeData ? node.nodeData.laynumber : 0
                        );
                        if (nodenumber <= layno) {
                            key.push(node.key);
                        }
                    };
                loopNode(treeData, keyHander);
                this.state.expandedKeys = key;
                this.setState(this.state);
            }
        };

        var createMore = () => {
            return (
                <NCMenu onSelect={onMenuSelect}>
                    <NCMenu.Item key="expandAll">展开所有</NCMenu.Item>
                    <NCMenu.Item key="unexpandAll">闭合所有</NCMenu.Item>
                    <NCMenu.NCSubMenu key="expandLay" title="展开层级">
                        {laybtns}
                    </NCMenu.NCSubMenu>
                </NCMenu>
            );
        };

        return (
            <div>
                <div>
                    <NCFormControl
                        type="search"
                        value={this.state.textValue}
                        onChange={value => {
                            this.state.textValue = value;
                            this.setState(this.state);
                        }}
                        onSearch={() => {
                            this.onTreeTypeChange(this.state.treetype);
                        }}
                    />
                    <NCDropdown
                        trigger={["click"]}
                        overlay={createMore()}
                        animation="slide-up"
                    >
                        <NCButton colors="primary" style={{ width: 50 }}>
                            更多
                        </NCButton>
                    </NCDropdown>
                </div>
                <div>
                    <RadioGroup
                        name="booktype"
                        selectedValue={this.state.treetype}
                        onChange={this.onTreeTypeChange.bind(this)}
                    >
                        <Radio value="type">账簿类型</Radio>
                        <Radio value="main">主账簿</Radio>
                    </RadioGroup>
                </div>
                <ReferTree
                    checkStrictly={true}
                    checkable={refType === "tree" && isMultiSelectedEnabled}
                    data={treeData}
                    onSelect={this.onTreeNodeSelectWapper.bind(this)}
                    onExpand={this.onTreeNodeExpand}
                    onCheck={this.onTreeNodeCheckWapper.bind(this)}
                    checkedKeys={[...selectedValues.keys()]}
                    selectedKeys={selectedKeys}
                    expandedKeys={expandedKeys}
                    autoExpandParent={false}
                    isTreelazyLoad={isTreelazyLoad}
                    root={rootNode}
                    onlyLeafCanSelect={onlyLeafCanSelect}
                    onDoubleClick={() => {}}
                />
            </div>
        );
    };
}

export default function(props = {}) {
    var conf = {
        refName: "财务核算账簿",
        placeholder: "财务核算账簿",
        rootNode: { refname: "财务核算账簿", refpk: "root" },
        refCode: "uapbd.ref.AccountBookTreeRef",
        queryTreeUrl: "/nccloud/uapbd/ref/AccountBookTreeRef.do",
        isMultiSelectedEnabled: false,
        refType: "tree",
        isTreelazyLoad: false,
        queryCondition: () => {
            return {
                TreeRefActionExt:
                    "nccloud.web.platform.workbench.ref.filter.AccountBookRefPermissionFilter"
            };
        },
        treeConfig: { name: ["编码", "名称"], code: ["refcode", "refname"] }
    };
    conf.rootNode = { ...conf.rootNode, treeid: "root" };
    return <Ref {...Object.assign(conf, props)} />;
}
