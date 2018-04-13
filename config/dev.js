const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const BaseData = require('./base');
let { configInfo, pubPath } = BaseData;
let cssLoader = {
	test: /\.(css|less)?$/,
	// exclude: /node_modules/,
	use: [ 'style-loader', 'css-loader', 'postcss-loader', 'less-loader' ]
	// use: [ 'css-loader', 'postcss-loader', 'less-loader' ]
};
configInfo.module.rules.push(cssLoader);
const port = '3000';
const host = '127.0.0.1';
module.exports = {
	...configInfo,
	/**
	 * mode 
	 * 
	 * production 生产模式
	 * development 开发模式
	 */
	mode: 'development',
	output: {
		path: path.join(pubPath, 'dist'),
		filename: '[name].[chunk:8].js', // 生产环境可以使用 chunkhash 文件内容 hash 校验
		// filename: '[name].[hash:8].js',
		libraryTarget: 'umd'
	},
	devServer: {
		contentBase: path.join(pubPath, 'dist'),
		port: port, // 端口号
		host: host, // 主机地址
		inline: true,
		hot: true,
		open: false,
		lazy: false,
		historyApiFallback: {
			rewrites: { from: /./, to: '/404.html' },
			disableDotRule: true
		},
		overlay: {
			warnings: true,
			errors: true
		},
		clientLogLevel: 'error',
		// 开启报错提示
		stats: 'errors-only',
		proxy: {
			'/': {
				// 代理地址
				target: 'http://10.11.115.25:80',
				bypass: function(req, res, proxyOptions) {
					if (req.headers.accept.indexOf('html') !== -1) {
						// console.log('Skipping proxy for browser request.');
						return '/index.html';
					}
				}
			}
		}
	},

	/**
     * devtool 选项
     * source-map 开发模式
     * eval 生产模式
     */
	devtool: 'source-map',

	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './index.html',
			inject: 'body',
			favicon: 'assets/images/favicon.png',
			cache: true,
			showErrors: true
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].css'
			// chunkFilename: '[id].css'
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new OpenBrowserPlugin({ url: `http://${host}:${port}` })
	]
};
