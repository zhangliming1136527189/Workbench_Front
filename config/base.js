const path = require('path');
/**
 * webpack 基础配置
 */
const pubPath = __dirname.split('config')[0];
module.exports = {
	configInfo: {
		context: path.resolve(pubPath, 'src'),
		entry: './app.js',

		// 包(bundle)应该运行的环境
		target: 'web',
		externals: {
			react: 'React',
			'react-dom': 'ReactDOM',
			axios: 'Axios'
		},
		module: {
			rules: [
				{
					test: /\.js[x]?$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				},
				{
					test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
					exclude: /favicon\.png$/,
					use: [
						{
							loader: 'url-loader',
							options: {
								limit: 1,
								name: 'assets/images/[name].[hash:8].[ext]'
							}
						}
					]
				}
			]
		},
		// 不要遵循/打包这些模块，而是在运行时从环境中请求他们
		externals: {
			react: 'React',
			'react-dom': 'ReactDOM',
			axios: 'Axios'
		},
		resolve: {
			extensions: [ '.jsx', '.js' ],
			alias: {
				Components: path.resolve(pubPath, 'src/components/'),
				Assets: path.resolve(pubPath, 'src/assets/'),
				Pages: path.resolve(pubPath, 'src/pages/'),
				Pub: path.resolve(pubPath, 'src/pub/'),
				Store: path.resolve(pubPath, 'src/store/')
			}
		}
	},
	pubPath: pubPath
};
