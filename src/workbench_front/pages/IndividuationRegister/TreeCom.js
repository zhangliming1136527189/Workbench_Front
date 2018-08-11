import React, { Component } from "react";
import { Tree } from "antd";
import { createTree } from "Pub/js/createTree.js";
import Svg from "Components/Svg";
const TreeNode = Tree.TreeNode;
class TreeCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: ["00"],
            searchValue: "",
            autoExpandParent: true
        };
    }
    onExpand = expandedKeys => {
        expandedKeys.push("00");
        expandedKeys = Array.from(new Set(expandedKeys));
        this.setState({
            expandedKeys,
            autoExpandParent: false
        });
    };
    onChange = e => {
        const value = e.target.value;
        this.setState({ searchValue: value }, () => {
            this.props.onSearch(value, this.handleExpanded);
        });
    };
    handleExpanded = dataList => {
        let expandedKeys = dataList.map((item, index) => {
            return item.code;
        });
        expandedKeys.push("00");
        expandedKeys = Array.from(new Set(expandedKeys));
        this.setState({
            expandedKeys,
            autoExpandParent: true
        });
    };
    handleSelect = (selectedKey, info) => {
        if (selectedKey.length === 0) {
            return;
        }
        this.props.onSelect(selectedKey[0]);
    };
    render() {
        const { searchValue, expandedKeys, autoExpandParent } = this.state;
        const loop = data =>
            data.map(item => {
                let { code, name } = item;
                let itemContent;
                if (code === "00") {
                    itemContent = `${name}`;
                } else {
                    itemContent = `${code} ${name}`;
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
                                        expandedKeys.indexOf(item.code) === -1
                                            ? "#icon-wenjianjia"
                                            : "#icon-wenjianjiadakai"
                                    }
                                />
                            }
                            key={code}
                            title={title}
                        >
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return (
                    <TreeNode
                        icon={<span className="tree-dot" />}
                        key={code}
                        title={title}
                    />
                );
            });
        let newTreeData = [
            {
                /* 给树填个根 */
                name: "个性化设置",
                code: "00",
                children: createTree(
                    this.props.dataSource,
                    "code",
                    "parentcode"
                )
            }
        ];
        return (
            <div className="individuation-tree-search">
                <Tree
                    showLine
                    showIcon
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    onSelect={this.handleSelect}
                    selectedKeys={this.props.selectedKeys}
                    autoExpandParent={autoExpandParent}
                >
                    {loop(newTreeData)}
                </Tree>
            </div>
        );
    }
}
export default TreeCom;
