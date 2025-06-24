const { h } = require('preact');
const renderToString = require('preact-render-to-string');
const path = require('path');

const Speakers = require('./src/routes/speakers');

module.exports = function(eleventyConfig) {
    // Adjust the glob path to match posts inside 'src/content/blog'
    eleventyConfig.addCollection('blogPosts', collection =>
        collection.getFilteredByGlob('src/content/blog/*.md').map(item => ({
            title: item.data.title || 'No title',
            date: item.data.date ? item.data.date.toISOString().slice(0, 10) : 'No date',
            excerpt: item.data.excerpt || '',
            slug: item.fileSlug || '',
        }))
    );

    eleventyConfig.addShortcode('Speakers', function() {
        const posts = this.ctx.collections.blogPosts || [];
        return renderToString(h(Speakers, { posts }));
    });

    return {
        dir: {
            input: 'src',     // Eleventy input folder
            output: 'dist',
            includes: '_includes',
            layouts: '_layouts',
        },
    };
};
