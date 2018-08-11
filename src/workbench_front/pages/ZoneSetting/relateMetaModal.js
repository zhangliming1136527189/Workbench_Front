import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { Icon, Tree, Modal, Button } from 'antd';
import { PageLayout, PageLayoutLeft, PageLayoutRight } from 'Components/PageLayout';
const TreeNode = Tree.TreeNode;
//元数据编辑关联项模态框
class RelateMetaModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			metaTree: [],
			selectTreeNodes: []
		};
	}
	onLoadData = (treeNode) => {
		return new Promise((resolve) => {
			if (treeNode.props.children) {
				resolve();
				return;
			}
			Ajax({
				url: `/nccloud/platform/templet/querymetapro.do`,
				info: {
					name: '单据模板设置',
					action: '元数据树结构查询'
				},
				data: {
					// metaid: metaid
					metaid: treeNode.props.refpk
				},
				success: (res) => {
					if (res) {
						let { data, success } = res.data;
						if (success && data && data.rows && data.rows.length > 0) {
							let metaTree = [];
							data.rows.map((r, index) => {
								metaTree.push({
									...r,
									title: `${r.refcode} ${r.refname}`,
									key: `${treeNode.props.myUniqID}.${r.refcode}`,
									myUniqID: `${treeNode.props.myUniqID}.${r.refcode}`,
									isLeaf: r.isleaf
								});
							});
							treeNode.props.dataRef.children = [].concat(metaTree);
							this.setState({ metaTree: [ ...this.state.metaTree ] });
							resolve();
						}
					}
				}
			});
		});
	};
	componentWillReceiveProps(nextProps) {
		if (nextProps.modalVisibel !== true) {
			return;
		} else {
			const { metaid, relatemeta } = this.props.selectCard;
			let { cards } = this.props;
			if (relatemeta && relatemeta !== '') {
				let tmpArr1 = relatemeta.split(',');
				let tmpArr2 = [];
				_.forEach(tmpArr1, (t) => {
					let tmpArr = t.split('=');
					tmpArr2.push({
						cardMetaPath: tmpArr[0],
						myMetaPath: tmpArr[1]
					});
				});
				_.forEach(cards, (c, index) => {
					_.forEach(tmpArr2, (t) => {
						if (t.cardMetaPath === c.metapath) {
							c.myMetaPath = t.myMetaPath;
						}
					});
				});
			}
			Ajax({
				url: `/nccloud/platform/templet/querymetapro.do`,
				info: {
					name: '单据模板设置',
					action: '元数据树结构查询'
				},
				data: {
					metaid: metaid
				},
				success: (res) => {
					if (res) {
						let { data, success } = res.data;
						if (success && data && data.rows && data.rows.length > 0) {
							let metaTree = [];
							data.rows.map((r, index) => {
								metaTree.push({
									...r,
									title: `${r.refcode} ${r.refname}`,
									key: `${r.refcode}`,
									myUniqID: `${r.refcode}`,
									isLeaf: r.isleaf
								});
							});
							this.setState({ metaTree: metaTree });
						} else {
							if (success && data && data.rows && !data.rows.length) {
								Notice({ status: 'warning', msg: '元数据树为空' });
							}
						}
					}
				}
			});
		}
	}
	showModalHidden = () => {
		let { cards } = this.props;
		_.forEach(cards, (c, i) => {
			if (c.myMetaPath && c.myMetaPath !== '') {
				c.myMetaPath = '';
			}
		});
		this.props.setModalVisibel('relateMetaModalVisibel', false);
	};
	onOkDialog = () => {
		let result = '';
		let { cards } = this.props;
		_.forEach(cards, (c, i) => {
			if (c.myMetaPath && c.myMetaPath !== '') {
				if (result === '') {
					result = `${c.code}=${c.myMetaPath}`;
				} else {
					result = `${result},${c.code}=${c.myMetaPath}`;
				}
			}
		});
		this.props.handleSelectChange(result, 'relatemeta');
		this.showModalHidden();
	};
	renderTreeNodes = (data) => {
		return data.map((item) => {
			if (item.children) {
				return (
					<TreeNode title={item.title} key={item.key} dataRef={item}>
						{this.renderTreeNodes(item.children)}
					</TreeNode>
				);
			}
			return <TreeNode {...item} dataRef={item} />;
		});
	};

	onSelect = (selectedKeys, info) => {
		this.setState({ selectedKeys, selectTreeNodes: info.selectedNodes });
	};

	cardClick = (card) => {
		let { selectTreeNodes } = this.state;

		if (selectTreeNodes.length > 0) {
			const tmpDataRef = selectTreeNodes[0].props.dataRef;
			if (tmpDataRef.datatype === card.datatype) {
				card.myMetaPath = tmpDataRef.myUniqID;
			} else {
				return;
			}
		} else {
			return;
		}

		this.setState({ selectedKeys: [], selectTreeNodes: [] });
	};

	deleteMyMetaPath = (card, index) => {
		card.myMetaPath = '';
		this.setState({ selectedKeys: [], selectTreeNodes: [] });
	};

	getOpacity = (cardDataType, selectTreeDataType) => {
		let result = 1;
		if (selectTreeDataType !== '') {
			if (cardDataType !== selectTreeDataType) {
				result = 0.5;
			}
		}
		return result;
	};
	render() {
		const { metaTree, selectTreeNodes } = this.state;
		const { cards } = this.props;
		let selectTreeNodeDatatype = '';
		if (selectTreeNodes.length > 0) {
			selectTreeNodeDatatype = selectTreeNodes[0].props.dataRef.datatype;
		}
		return (
			<Modal
				closable={false}
				title={
					<div>
						元数据编辑关联项
						<span style={{ fontSize: '13px', marginLeft: '10px' }}>请在点击选择左侧树，然后点击选择右侧列表</span>
					</div>
				}
				mask={false}
				wrapClassName='realate-meta-modal'
				visible={this.props.modalVisibel}
				onOk={this.onOkDialog}
				destroyOnClose={true}
				onCancel={this.showModalHidden}
				width={'80%'}
				style={{ top: 20 }}
				footer={[
					<Button
						key='submit'
						// disabled={}
						type='primary'
						onClick={this.onOkDialog}
					>
						确定
					</Button>,
					<Button key='back' onClick={this.showModalHidden}>
						取消
					</Button>
				]}
			>
				<PageLayout>
					<PageLayoutLeft>
						<div className='sider-tree'>
							<Tree
								loadData={this.onLoadData}
								showLine={true}
								onSelect={this.onSelect}
								selectedKeys={this.state.selectedKeys}
							>
								{this.renderTreeNodes(metaTree)}
							</Tree>
						</div>
					</PageLayoutLeft>
					<PageLayoutRight>
						<div className='sider-list'>
							<table>
								<thead>
									<tr>
										<th>列</th>
										<th>元数据路径</th>
									</tr>
								</thead>
								<tbody>
									{cards.map((c, i) => {
										//必须是元数据并且不包含.,也就是根节点或者子表的根节点
										//最新逻辑去掉只显示根节点的逻辑
										if (c.metapath && c.metapath !== '') {
											return (
												<tr
													key={i}
													onClick={(e) => {
														this.cardClick(c);
													}}
													style={{
														opacity: this.getOpacity(c.datatype, selectTreeNodeDatatype)
													}}
												>
													<td>{c.label}</td>
													{(() => {
														if (c.myMetaPath && c.myMetaPath !== '') {
															return (
																<td>
																	<div className='close-and-text'>
																		<Icon
																			type='close'
																			onClick={() => {
																				this.deleteMyMetaPath(c, i);
																			}}
																		/>&nbsp;
																		{c.myMetaPath}
																	</div>
																</td>
															);
														} else {
															return <td />;
														}
													})()}
												</tr>
											);
										}
									})}
								</tbody>
							</table>
						</div>
					</PageLayoutRight>
				</PageLayout>
			</Modal>
		);
	}
}
export default connect(
	(state) => ({
		selectCard: state.zoneSettingData.selectCard
	}),
	{}
)(RelateMetaModal);
