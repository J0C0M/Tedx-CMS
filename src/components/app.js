import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { Provider } from '@preact/prerender-data-provider';
import Header from './header';
import Footer from './footer';

// Code-splitting is automated for routes
import Home from '../routes/home';
import Speakers from '../routes/speakers';
import Blogs from '../routes/blogs';
import NotFoundPage from '../routes/notfound';

export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](https://github.com/preactjs/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render(props) {
		return (
			<Provider value={props}>
				<div id="app">
					<Header />
					<main style="padding-top: 80px;">
						<Router onChange={this.handleRoute}>
							<Home path="/" />
							<Speakers path="/speakers/" />
							<Blogs path="/blogs/" />
							<NotFoundPage type="404" default />
						</Router>
					</main>
					<Footer />
				</div>
			</Provider>
		);
	}
}