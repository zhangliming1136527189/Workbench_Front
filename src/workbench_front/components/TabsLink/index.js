import React, { Component } from 'react';
import { Link } from 'react-scroll';
import { connect } from 'react-redux';
import './index.less';

class TabsLink extends Component {
	constructor(props, context) {
		super(props, context);
	}
	
	createTabsLink = () => {
		return this.props.groups.map((item, index) => {
			let { pk_app_group, groupname } = item;
			return (
				<li key={pk_app_group}>
					<Link activeClass ='active' to={pk_app_group} offset={-48} spy={true} smooth={true} duration={500}>
						{groupname}
						<span></span>
					</Link>
				</li>
			);
		});
	};
	render() {
		return <ul className='n-tabs'>{this.createTabsLink()}</ul>;
	}
}
export default connect(
		(state) => ({
			groups: state.homeData.groups
		}),
		{ }
	)(TabsLink)
