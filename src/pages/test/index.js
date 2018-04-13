import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeIntlData, saveImg, clearData } from 'Store/home/action';
// 工作桌面单页通用布局
import PageLayout from 'Components/PageLayout';
import TabsLink from 'Components/TabsLink';
import './index.less';
// drag && drop
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';


import Items from './card.js';
import _ from 'lodash';
// ReactDOM.render(<DatePicker />, mountNode);
class Test extends Component {
	constructor(props) {
		super(props);
		this.state = { cards: [
			{
				id: 1,
				x:0,
				y:0,
				w:200,
				h:200,
				text: 'Write a cool JS library'
			},
			{
				id: 2,
				x:300,
				y:300,
				w:200,
				h:200,
				text: 'Make it generic enough'
			},
			// {
			// 	id: 3,
			// 	x:300,
			// 	y:300,
			// 	w:300,
			// 	h:400,
			// 	text: 'Write README'
			// },
			// {
			// 	id: 4,
			// 	x:400,
			// 	y:400,
			// 	w:400,
			// 	h:500,
			// 	text: 'Create some examples'
			// }
		]
		 };
	}

	createItems(cards){
		let itemDoms = [];
	   _.forEach(cards,(c)=>{
		itemDoms.push(
			<Items x={c.x} y={c.y} w={c.w} h={c.h} id={c.id}/>
		);
	   });
	   return itemDoms;
	}

	render() {
		let aaa;
		return (
			<div className='nc-workbench-home-page'>
				<div className='nc-workbench-home-container'>
				{this.createItems(this.state.cards)}
				</div>
			</div>
		);
	}
}

export default DragDropContext(HTML5Backend)(connect(
	(state) => ({
		formData: state.formData,
		proData: state.proData
	}),
	{
		changeIntlData,
		saveImg,
		clearData
	}
)(Test))
