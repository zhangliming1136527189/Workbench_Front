import React, { Component } from 'react';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import { changeIntlData } from 'Store/appStore/action';
const SUPPOER_LOCALES = [
	{
		name: 'English',
		value: 'en-US'
	},
	{
		name: '简体中文',
		value: 'zh-CN'
	},
	{
		name: '繁體中文',
		value: 'zh-TW'
	}
	// {
	// 	name: 'français',
	// 	value: 'fr-FR'
	// },
	// {
	// 	name: '日本の',
	// 	value: 'ja-JP'
	// }
];
/**
 * 国际化组件
 */
class ChangeLanguage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initDone: false,
			currentLocale: 'en-US'
		};
	}
	componentDidMount() {
		this.setState(
			{
				currentLocale: navigator.language
			},
			this.loadLocales
		);
	}
	loadLocales = () => {
		let { currentLocale } = this.state;
		axios({
			method: 'get',
			url: `/prod-dist/intl/${currentLocale}.json`
		})
			.then((res) => {
				console.log('App locale data', res.data);
				// init method will load CLDR locale data according to currentLocale
				intl.init({
					currentLocale,
					locales: {
						[currentLocale]: res.data
					}
				});
			})
			.then(() => {
				// After loading CLDR locale data, start to render
				this.props.changeIntlData(true);
			});
		// axios.get(`/${currentLocale}.json`)
	};
	onSelectLocale = (e) => {
		let lang = e.target.value;
		this.setState(
			{
				currentLocale: lang
			},
			this.loadLocales
		);
	};
	render() {
		return (
			<select onChange={this.onSelectLocale} defaultValue=''>
				<option value='' disabled>
					Change Language
				</option>
				{SUPPOER_LOCALES.map((locale) => (
					<option key={locale.value} value={locale.value}>
						{locale.name}
					</option>
				))}
			</select>
		);
	}
}
ChangeLanguage.propTypes = {
	changeIntlData: PropTypes.bool.isRequired
};
export default connect((state) => ({}), { changeIntlData })(ChangeLanguage);
