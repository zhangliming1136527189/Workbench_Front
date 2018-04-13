const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BaseData = require('./base');
let { configInfo, pubPath } = BaseData;
let cssLoader = {
	test: /\.(css|less)$/,
	// exclude: /node_modules/,
	use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader' ]
	// loader: 'style-loader!postcss-loader!less-loader'
};
configInfo.module.rules.push(cssLoader);
module.exports = {
	...configInfo,
	/**
	 * mode 
	 * 
	 * production 生产模式
	 * development 开发模式
	 */
	mode: 'production',
	output: {
		path: path.join(pubPath, 'dist'),
		filename: '[name].[chunkhash:8].js', // 生产环境可以使用 chunkhash 文件内容 hash 校验
		libraryTarget: 'umd'
	},
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
			filename: '[name].[chunkhash:8].css'
			// chunkFilename: '[id].css'
		}),
		new CleanWebpackPlugin(
			[ 'dist' ] //匹配删除的文件
		),
		new CopyWebpackPlugin([
			{ from: pubPath + '/prod-dist', to: './prod-dist' },
			{ from: pubPath + '/pageInfo.json', to: '' }
		])
	]
};
