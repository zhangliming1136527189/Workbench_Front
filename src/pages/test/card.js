import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource ,DropTarget} from 'react-dnd';
import { findDOMNode } from 'react-dom'
const UNIT = 150;
import { Card } from 'antd';

const noteSource = {
  beginDrag(props) {
    console.log('begin dragging note', props);

    return {};
  }
};

const noteTarget = {
  hover(targetProps, monitor,component) {
		const sourceProps = monitor.getItem();
		console.log(sourceProps.id);

    console.log('dragging note', sourceProps, targetProps,monitor,component);
  }
};

class Item extends Component {
  render() {
		const {
			connectDragSource,
			connectDropTarget,
			aaaaa
	} = this.props;
		const {id,x,y,w,h}=this.props;
		console.log(id,x,y,w,h);
		return connectDragSource(connectDropTarget(
			<div style={{ width: w, height: h,background:'#ccc', transform: `translate(${x}px, ${y}px)`,opacity: aaaaa ? 0.5 : 1,}}>{id}
				 {/* <Card title="Card title" extra={<a href="#">More</a>} style={{ width: w, height: h, transform: `translate(${x}px, ${y}px)`, position: `absolute` }}>
				 	<p>Card content</p>
				 	<p>Card content</p>
				 	<p>Card content</p>
				 </Card> */}
			</div>
			
		)
			
		)
  }
}

function collectSource(connect,monitor){
	return {connectDragSource: connect.dragSource(),aaaaa: monitor.isDragging()} 
}

function collectTarget(connect){
	 return {	connectDropTarget: connect.dropTarget() }
}

// Export the wrapped component:
export default DropTarget('card',noteTarget,collectTarget)(DragSource('card',noteSource,collectSource)(Item));
// export default DropTarget('card', cardTarget, collectTarget)(DragSource('card', cardSource, collect)(Item));