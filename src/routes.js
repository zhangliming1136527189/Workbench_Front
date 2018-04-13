import React from 'react';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import Layout from './layout';
// import Main from 'Pages/main';
// import Ifr from 'Pages/ifr';

import Loading from 'Components/Loading';

const Home = Loadable({
	loader: () => import('Pages/home'),
	loading: Loading
});
const Ifr = Loadable({
	loader: () => import('Pages/ifr'),
	loading: Loading
});
const NotFound = Loadable({
	loader: () => import('Pages/404'),
	loading: Loading
});
const Drag = Loadable({
	loader: () => import('Pages/drag'),
	loading: Loading
});
const Test = Loadable({
	loader: () => import('Pages/test'),
	loading: Loading
});
const routes = [
	{
		path: '/',
		exact: true,
		component: Home
	},
	{
		path: '/ifr',
		component: Ifr
	},
	{
		path: '/404',
		component: NotFound
	},
	{
		path: '/drag',
		component: Drag
	},
	{
		path: '/test',
		component: Test
	}
];
const RouteWithSubRoutes = (route) => (
	<Route
		path={route.path}
		render={(props) => (
			// pass the sub-routes down to keep nesting
			<route.component {...props} />
		)}
	/>
);
const RouteConfig = () => (
	<Router>
		<Layout>
			<Switch>
				{routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
				<Route component={(infor) => <NotFound location={infor.location} />} />
			</Switch>
		</Layout>
	</Router>
);
export default RouteConfig;
