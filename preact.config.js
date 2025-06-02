import netlifyPlugin from 'preact-cli-plugin-netlify';
import ImageminPlugin from 'imagemin-webpack-plugin';
import imageminWebp from 'imagemin-webp';

export default (config, env) => {
	netlifyPlugin(config);

	if (env.production && !env.ssr) {
		config.plugins.push(new ImageminPlugin.default({
			from: './build/assets/**',
			pngquant: {
				quality: '60'
			},
			plugins: [
				imageminWebp({
					quality: 50
				})
			]
		}));
	}

	return config;
};