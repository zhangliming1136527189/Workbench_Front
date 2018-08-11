import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import CardListDragPreview from './cardListDragPreview';

@DragLayer((monitor) => ({
	item: monitor.getItem(),
	itemType: monitor.getItemType(),
	currentOffset: monitor.getSourceClientOffset(),
	clientOffset: monitor.getClientOffset(),
	isDragging: monitor.isDragging()
}))
export default class CustomDragLayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			layerStyle: { display: 'none' }
		};
	}
	renderItem(type, item) {
		switch (type) {
			case 'item':
				if (item.cardList) {
					return <CardListDragPreview cardListLength={item.cardList.length} />;
				} else {
					return null;
				}

			default:
				return null;
		}
	}

	componentWillUnmount() {
		cancelAnimationFrame(this.requestedFrame);
	}

	getMyItemStyles() {
		requestAnimationFrame(this.getItemStyles);
	}

	getItemStyles = () => {
		const { clientOffset } = this.props;

		if (!clientOffset) {
			return {
				display: 'none'
			};
		}
		let { x, y } = clientOffset;
		const transform = `translate(${x}px, ${y}px)`;
		return {
			transform,
			WebkitTransform: transform
		};
	};

	shouldComponentUpdate(nextProps, nextState) {
		const thisProps = this.props || {},
			thisState = this.state || {};
		if (this.props.item && this.props.item.type === 'cardlist' && this.props.isDragging !== nextProps.isDragging) {
			return true;
		}
		if (
			this.props.item &&
			this.props.item.type === 'cardlist' &&
			this.props.currentOffset !== nextProps.currentOffset
		) {
			if (
				nextProps.currentOffset &&
				Math.pow(
					Math.pow(this.props.clientOffset.x - nextProps.clientOffset.x, 2) +
						Math.pow(this.props.clientOffset.y - nextProps.clientOffset.y, 2),
					0.5
				) > 1.5
			) {
				return true;
			}
		}
		return false;
	}
	render() {
		const { item, itemType, isDragging } = this.props;
		if (!isDragging || item.type !== 'cardlist') {
			return null;
		}
		return (
			<div className='desk-setting-layer'>
				<div style={this.getItemStyles()}>{this.renderItem(itemType, item)}</div>
			</div>
		);
	}
}
