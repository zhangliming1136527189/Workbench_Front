import React, { Component } from "react";
import { Tree, Input } from "antd";
import Svg from "Components/Svg";
import { createTree } from "Pub/js/createTree.js";
const TreeNode = Tree.TreeNode;
class TreeSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            autoExpandParent: false
        };
    }
    /**
     * 树节点展开事件
     */
    onExpand = expandedKeys => {
        expandedKeys = expandedKeys.concat(["00"]);
        this.props.setExpandedKeys(expandedKeys);
        this.setState({
            autoExpandParent: false
        });
    };
    /**
     * 查询框值改变事件
     */
    onChange = e => {
        const value = e.target.value;
        this.setState({ searchValue: value }, () => {
            this.props.onSearch(value, this.handleExpanded);
        });
    };
    /**
     * 查询后展开满足条件的树节点
     */
    handleExpanded = dataList => {
        if (this.state.searchValue.length > 0) {
            const expandedKeys = dataList.map((item, index) => {
                return item.menuitemcode;
            });
            this.props.setExpandedKeys(expandedKeys);
        } else {
            this.props.setExpandedKeys(["00"]);
        }
        this.setState({
            autoExpandParent: true
        });
    };
    /**
     * 查询框删除按钮
     */
    handleSearchDel = () => {
        this.setState({ searchValue: "" }, () => {
            this.props.onSearch("");
        });
    };
    /**
     * 树选中节点事件
     */
    handleSelect = selectedKey => {
        if (selectedKey.length === 0) {
            return;
        }
        this.props.setSelectedKeys(selectedKey);
    };
    render() {
        const { searchValue, autoExpandParent } = this.state;
        const loop = data =>
            data.map(item => {
                let { menuitemcode, menuitemname } = item;
                let itemContent;
                if (menuitemcode === "00") {
                    itemContent = `${menuitemname}`;
                } else {
                    itemContent = `${menuitemcode} ${menuitemname}`;
                }
                const index = itemContent.indexOf(searchValue);
                const beforeStr = itemContent.substr(0, index);
                const afterStr = itemContent.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span style={{ color: "#f50" }}>{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{itemContent}</span>
                    );
                if (item.children) {
                    return (
                        <TreeNode
                            icon={
                                <Svg
                                    width={16}
                                    height={16}
                                    xlinkHref={
                                        this.props.expandedKeys.indexOf(
                                            item.menuitemcode
                                        ) === -1
                                            ? "#icon-wenjianjia"
                                            : "#icon-wenjianjiadakai"
                                    }
                                />
                            }
                            key={menuitemcode}
                            title={title}
                        >
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return (
                    <TreeNode
                        icon={<span className="tree-dot" />}
                        key={menuitemcode}
                        title={title}
                    />
                );
            });
        let newTreeData = [
            {
                /* 给树填个根 */
                menuitemname: "菜单树",
                menuitemcode: "00",
                children: createTree(
                    this.props.dataSource,
                    "menuitemcode",
                    "parentcode"
                )
            }
        ];
        return (
            <div className="menuitem-tree-search">
                <div className="fixed-search-input">
                    <Input
                        value={searchValue}
                        placeholder="查询应用"
                        onChange={this.onChange}
                        suffix={
                            searchValue.length > 0 ? (
                                <i
                                    className="iconfont icon-qingkong"
                                    onClick={this.handleSearchDel}
                                />
                            ) : (
                                <i className="iconfont icon-sousuo" />
                            )
                        }
                    />
                </div>
                <Tree
                    showLine
                    showIcon
                    onExpand={this.onExpand}
                    expandedKeys={this.props.expandedKeys}
                    selectedKeys={this.props.selectedKeys}
                    onSelect={this.handleSelect}
                    autoExpandParent={autoExpandParent}
                >
                    {loop(newTreeData)}
                </Tree>
            </div>
        );
    }
}
export default TreeSearch;
