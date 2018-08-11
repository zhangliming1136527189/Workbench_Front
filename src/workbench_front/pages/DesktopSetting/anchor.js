import React, { Component } from 'react';
import './index.less';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { Link } from 'react-scroll';

const anchorTarget = {
	drop(props, monitor, component) {
		const dragItem = monitor.getItem();
		const dropItem = props;
		if (dragItem.type === 'cardlist') {
			props.onCardListDropInGroupItem(dragItem, dropItem);
		}
	},
	canDrop(props, monitor) {
		// You can disallow drop based on props or item
		//retutrn false,则monitor.didDrop()为undefined
		const dragItem = monitor.getItem();
		if (dragItem.type === 'cardlist') {
			return true;
		} else {
			return false;
		}
	}
};

@DropTarget('item', anchorTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver()
}))
class AnchorLi extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	targetAnchor = () => {
		const targetID = this.props.id;
		//id不能以数字开头
		// document.querySelector(`#a${targetID}`).scrollIntoView({ block: 'start',  behavior: 'smooth' });
		document.querySelector(`#a${targetID}`).scrollIntoView();
	};
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.name !== nextProps.name) {
			return true;
		}
		if (this.props.index !== nextProps.index) {
			return true;
		}
		if (this.props.isOver !== nextProps.isOver) {
			return true;
		}
		return false;
	}
	render() {
		const { connectDropTarget, isOver, name, id } = this.props;
		return connectDropTarget(
			<span className='anchor' style={{ background: isOver ? 'rgb(204, 204, 204)' : '' }}>
				<Link
					activeClass='active'
					to={`a${id}`}
					offset={-139}
					spy={true}
					smooth={true}
					duration={250}
					containerId='nc-workbench-home-container'
				>
					{name}
					<span />
				</Link>
			</span>
		);
	}
}

class MyContentAnchor extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { groups } = this.props;
		return (
			<div className='content-anchor'>
				{groups.map((g, i) => {
					return <AnchorLi onCardListDropInGroupItem={this.props.onCardListDropInGroupItem} key={g.pk_app_group} id={g.pk_app_group} index={i} name={g.groupname} />;
				})}
			</div>
		);
	}
}

export default connect(
	(state) => ({
		groups: state.templateDragData.groups
	}),
	{}
)(MyContentAnchor);
