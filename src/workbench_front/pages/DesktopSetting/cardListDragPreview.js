import React, { Component } from 'react';

export default class CardListDragPreview extends Component {
	constructor(props) {
		super(props);
	}
	shouldComponentUpdate(nextProps, nextState) {
		const thisProps = this.props || {},
			thisState = this.state || {};
		if (this.props.cardListLength !== nextProps.cardListLength) {
			return true;
		}
		return false;
	}
	render() {
		const { cardListLength } = this.props;
		let divDom = [];
		for (let index = 0; index < cardListLength; index++) {
			if (index === cardListLength - 1) {
				const myIndex = index >= 3 ? 3 : index;
				divDom.push(
					<div
						key={index}
						className='layer-card'
						style={{ left: `${myIndex * 5}px`, top: `${myIndex * 5}px` }}
						// style={{ transform:`translate(${myIndex * 5}px, ${myIndex * 5}px)`}}
					>
						<span className='layer-card-span'>{cardListLength}</span>
					</div>
				);
			} else if (index < 3) {
				divDom.push(
					<div key={index} className='layer-card' style={{ left: `${index * 5}px`, top: `${index * 5}px` }} />
				);
			}
		}
		return <div className='desk-setting-layer-card-list'>{divDom}</div>;
	}
}
