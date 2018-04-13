import React, { Component } from 'react';
import { Link } from 'react-scroll';
import './index.less';
const tabs = [
	{
		anchor: 'no1',
		text: '分组一'
	},
	// {
	// 	anchor: 'no2',
	// 	text: '分组二'
	// }
	// {
	// 	anchor: 'no3',
	// 	text: '分组三'
	// },
	// {
	// 	anchor: 'no4',
	// 	text: '分组四'
	// }
];
class TabsLink extends Component {
	constructor(props, context) {
		super(props, context);
	}
	createTabsLink = () => {
		return tabs.map((item, index) => {
			let { anchor, text } = item;
			return (
				<li>
					<Link activeClass="active" to={anchor} offset={-40} spy={true} smooth={true} duration={500}>
						{text}
					</Link>
				</li>
			);
		});
	};
	render() {
		return <ul className="n-tabs">{this.createTabsLink()}</ul>;
	}
}
export default TabsLink;
