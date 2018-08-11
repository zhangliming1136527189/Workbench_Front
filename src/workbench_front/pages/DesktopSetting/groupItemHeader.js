import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Input, Checkbox, Popconfirm, Tooltip } from 'antd';
import { updateCurrEditID } from 'Store/test/action';
const defaultNormalPopTitle = '请输入分组名称，回车确定';
const defaultErrorPoptitle = "分组名不能为空"

class GroupItemHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
            groupName: props.groupname,
			popTitle: defaultNormalPopTitle
		};
    }
    componentDidMount() {
        if(this.props.currEditID === this.props.id){
            this.editGroupItemName()
        }
		
	}
	//向上移动组
	upGroupItem = () => {
		this.props.upGroupItem(this.props.index);
	};
	//向下移动组
	downGroupItem = () => {
		this.props.downGroupItem(this.props.index);
	};
	//删除组
	deleteGroupItem = () => {
		this.props.deleteGroupItem(this.props.id);
	};
	//获得组名
	getGroupName = (e) => {
		let _groupName = e.target.value;
		if (_groupName === '') {
			this.setState({ popTitle: defaultErrorPoptitle });
		}else{
            this.setState({ popTitle: defaultNormalPopTitle });
        }
        this.setState({ groupName: _groupName });
	};
	//组名进入编辑状态
	editGroupItemName = () => {
		this.asyncUpdateCurrEditID(this.props.id).then(() => {
			this.refs.editInputDom.focus();
			// dom节点调用
			if (this.refs.editInputDom && this.refs.editInputDom.input) {
				this.refs.editInputDom.input.select();
			}
		});
	};
	async asyncUpdateCurrEditID(id) {
		let user = await this.props.updateCurrEditID(id);;
		return user;
	}
	//改变组名
	changeGroupName = () => {
		let index = this.props.index;
		let groupname = this.state.groupName;
		if (groupname === '') {
            this.setState({ popTitle: defaultErrorPoptitle });
		} else {
            this.setState({ popTitle: defaultNormalPopTitle });
			this.props.changeGroupName(index, groupname);
		}
	};
	//取消编辑组名
	cancelGroupName = () => {
		this.props.updateCurrEditID('');
    };
    //
	shouldComponentUpdate(nextProps, nextState) {
		const thisProps = this.props || {},
			thisState = this.state || {};
		if (this.props.groupname !== nextProps.groupname) {
			return true;
		}
		if (this.props.currEditID !== nextProps.currEditID) {
			return true;
		}
		if (this.props.index !== nextProps.index) {
			return true;
		}
		if (this.state.popTitle !== nextState.popTitle) {
			return true;
		}
		if (this.props.length !== nextProps.length) {
			return true;
		}
		return false;
	}

	render() {
		const { groupname, id, index, length, currEditID } = this.props;
		// console.log('groupHeader', groupname);
		let groupItemTitle;
		if (currEditID === id) {
			groupItemTitle = (
				<div className='group-item-title-container-no-edit'>
					<div className='title-left' ref='titleLeft'>
						<Tooltip trigger={[ 'focus' ]} autoAdjustOverflow={false} getPopupContainer={()=>{return this.refs.titleLeft}} title={this.state.popTitle} placement='bottomLeft'>
							<Input
								ref='editInputDom'
								size='small'
								placeholder='分组名称，回车确定'
								defaultValue={groupname}
								onPressEnter={this.changeGroupName}
								onChange={this.getGroupName}
							/>
						</Tooltip>

						<Icon
							type='check-square-o'
							className='group-item-icon'
							title='确定'
							onClick={this.changeGroupName}
						/>
						<Icon
							type='close-square-o'
							className='group-item-icon'
							title='取消'
							onClick={this.cancelGroupName}
						/>
					</div>
				</div>
			);
		} else {
			groupItemTitle = (
				<div className='group-item-title-container-no-edit'>
					<div className='title-left'>
						{/* <Checkbox checked={}></Checkbox> */}
						<span className='group-item-title' onClick={this.editGroupItemName}>
							{groupname}
						</span>
						<div className='group-item-title-edit'>
							<Icon
								type='edit'
								title='分组重命名'
								className='group-item-icon'
								onClick={this.editGroupItemName}
							/>
						</div>
					</div>
					<div className='title-right'>
						<div className={index === 0 ? 'group-item-title-not-edit' : 'group-item-title-edit'}>
							<Icon
								type='up-square-o'
								title='分组上移'
								className='group-item-icon'
								onClick={this.upGroupItem}
							/>
						</div>
						<div className={index === length - 1 ? 'group-item-title-not-edit' : 'group-item-title-edit'}>
							<Icon
								type='down-square-o'
								title='分组下移'
								className='group-item-icon'
								onClick={this.downGroupItem}
							/>
						</div>
						<div className='group-item-title-edit'>
							<Popconfirm
								title='确定删除该分组？'
								onConfirm={this.deleteGroupItem}
								placement='topRight'
								okText='确定'
								cancelText='取消'
							>
								<Icon type='close-square-o' title='分组删除' className='group-item-icon' />
							</Popconfirm>
						</div>
					</div>
				</div>
			);
		}

		return groupItemTitle;
	}
}

export default connect(
	(state) => ({
		currEditID: state.templateDragData.currEditID
	}),
	{
		updateCurrEditID
	}
)(GroupItemHeader);
