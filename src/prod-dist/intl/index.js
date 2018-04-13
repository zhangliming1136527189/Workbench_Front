import React, { Component } from 'react';
import Intl from 'react-intl-universal';
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
class ChangeLanguage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initDone: false
		};
	}
	componentDidMount() {
		this.loadLocales();
	}
	loadLocales = () => {
		let currentLocale = navigator.language;
		let flag = SUPPOER_LOCALES.find((item) => {
			return item.value === currentLocale;
		});
		if (!flag) {
			currentLocale = 'en-US';
		}
		axios({
			method: 'get',
			url: `./intl/${currentLocale}.json`
		})
			.then((res) => {
				console.log('App locale data', res.data);
				// init method will load CLDR locale data according to currentLocale
				return intl.init({
					currentLocale,
					locales: {
						[currentLocale]: res.data
					}
				});
			})
			.then(() => {
				// After loading CLDR locale data, start to render
				this.setState({ initDone: true });
			});
		// axios.get(`/${currentLocale}.json`)
	};
	onSelectLocale = (e) => {
		let lang = e.target.value;
		console.log(lang);
	};
	render() {
		return (
			this.state.initDone && (
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
			)
		);
	}
}
export default ChangeLanguage;
