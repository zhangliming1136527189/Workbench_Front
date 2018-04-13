import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource ,DropTarget} from 'react-dnd';
import { findDOMNode } from 'react-dom'
const UNIT = 150;

/**
 * Implements the drag source contract.
 */
const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
	},
}

const cardTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
		}

		// Time to actually perform the action
		props.moveCard(dragIndex, hoverIndex)

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex
	},
}
/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
  };
}


function collectTarget  (connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
    };
  }

const propTypes = {
  text: PropTypes.string.isRequired,

  // Injected by React DnD:
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
};

class Card extends Component {
    static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		isDragging: PropTypes.bool.isRequired,
		id: PropTypes.any.isRequired,
		text: PropTypes.string.isRequired,
		moveCard: PropTypes.func.isRequired,
	}
  render() {
    // const { isDragging, connectDragSource, text } = this.props;
    // return connectDragSource(
    //     <div style={{ width: `${UNIT}px`, height: `${UNIT}px`,opacity: isDragging ? 0.5 : 1  }} className={`grid-item widget-container `}>
    //     {text}
    //   </div>
    // );

    const {
        text,
        isDragging,
        connectDragSource,
        connectDropTarget,
        index,
        height,
        width
    } = this.props
    const opacity = isDragging ? 0 : 1

    return connectDragSource(
        connectDropTarget(
            <div class="item">
            <div style={{ width: `${width}px`, height: `${height}px`,opacity: isDragging ? 0.5 : 1,float:'left','margin-left':'10px',background:'#ccc'  }} className={` widget-container `}>{text}</div>

          </div>
        ),
        // connectDropTarget(<div style={{ ...style, opacity }}>{text}</div>),
    )
  }
}

Card.propTypes = propTypes;

// Export the wrapped component:
export default DropTarget('card', cardTarget, collectTarget)(DragSource('card', cardSource, collect)(Card));