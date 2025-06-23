import netlifyPlugin from 'preact-cli-plugin-netlify';
import ImageminPlugin from 'imagemin-webpack-plugin/dist';

export default (config, env) => {
	netlifyPlugin(config);

	if (env.production && !env.ssr) {
		config.plugins.push(new ImageminPlugin({
			from: './build/assets/**',
			pngquant: {
				quality: '60'
			}
		}));
	}

	return config;
};
