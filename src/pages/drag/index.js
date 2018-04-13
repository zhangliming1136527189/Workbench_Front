import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeIntlData, saveImg, clearData } from 'Store/home/action';
// import Masonry from 'masonry-layout';
// import Masonry from 'react-masonry-component';
// import RGL, { WidthProvider } from "react-grid-layout";
// import Muuri from 'muuri';
import { Link as TabLink, Element } from 'react-scroll';
// 工作桌面单页通用布局
import PageLayout from 'Components/PageLayout';
import TabsLink from 'Components/TabsLink';
import './index.less';
import Card from './card.js';
// drag && drop
// import { DragDropContextProvider } from 'react-dnd'
// import HTML5Backend from 'react-dnd-html5-backend'
// import { DragDropContext } from 'react-dnd';
// import GridLayout from 'react-grid-layout';
// import update from 'immutability-helper'
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);

const UNIT = 150;
let msnry = null;
/**
 * 工作桌面 首页 页面
 * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染
 */
class Drag extends Component {
	static defaultProps = {
		className: "layout",
		items: 20,
		rowHeight: 30,
		onLayoutChange: function() {},
		cols: 12
	  };

	constructor(props) {
		super(props);
		const layout = this.generateLayout();
		this.state = { layout };
	}

	generateDOM() {
		return _.map(_.range(this.props.items), function(i) {
		  return (
			<div style={{background:"#CCC"}} key={i}>
			  <span className="text">{i}</span>
			</div>
		  );
		});
	}


	  generateLayout() {
		const p = this.props;
		return _.map(new Array(p.items), function(item, i) {
		  const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
		  const x = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
		  return {
			x: (i * 2) % 12,
			y: Math.floor(i / 6) * y,
			w: 2,
			h: y,
			i: i.toString()
		  };
		});
	  }

	  onLayoutChange(layout) {
		this.props.onLayoutChange(layout);
	  }
	// componentDidMount() {
	// 	const grid = new Muuri('.grid');
	// 	// let grid = document.querySelectorAll('.grid');
	// 	// for (let index = 0; index < grid.length; index++) {
	// 	// 	console.log(grid.length);
	// 	// 	const element = grid[index];
	// 	// 	msnry = new Masonry(element, {
	// 	// 		itemSelector: '.grid-item',
	// 	// 		columnWidth: 170,
	// 	// 		gutter: 10
	// 	// 	});
	// 	// }
	// }

	// moveCard(dragIndex, hoverIndex) {
	// 	const { cards } = this.state
	// 	const dragCard = cards[dragIndex]
		
	// 	this.setState(
	// 		update(this.state, {
	// 			cards: {
	// 				$splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
	// 			},
	// 		}),
	// 	)
	// }

	render() {
		const { cards } = this.state
		return (
			<div className='nc-workbench-home-page'>
				<div className='nc-workbench-home-container'>
					<ReactGridLayout
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
        {...this.props}
      >
        {this.generateDOM()}
      </ReactGridLayout>
					
				</div>
			</div>
		);
	}
}

export default (connect(
	(state) => ({
		formData: state.formData,
		proData: state.proData
	}),
	{
		changeIntlData,
		saveImg,
		clearData
	}
)(Drag))
