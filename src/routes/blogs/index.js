import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router';
import parseMd from 'parse-md';
import style from './style.css';

const Blogs = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadBlogPosts();
	}, []);

	const loadBlogPosts = async () => {
		try {
			// Get all markdown files from content/blog directory
			const context = require.context('../../../content/blog', false, /\.md$/);
			const posts = [];

			for (const key of context.keys()) {
				const response = await fetch(key.replace('./', '/content/blog/'));
				const text = await response.text();
				const { metadata, content } = parseMd(text);

				posts.push({
					slug: key.replace('./', '').replace('.md', ''),
					...metadata,
					content,
					excerpt: content.substring(0, 200) + '...'
				});
			}

			// Sort posts by date (newest first)
			posts.sort((a, b) => new Date(b.date) - new Date(a.date));
			setPosts(posts);
		}
		catch (error) {
			console.error('Error loading blog posts:', error);
		}
		finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div class={style.container}>
				<div class={style.loading}>Loading posts...</div>
			</div>
		);
	}

	return (
		<div class={style.blogs}>
			<div class={style.container}>
				<header class={style.header}>
					<h1>Blog Posts</h1>
					<p>Latest updates and insights</p>
				</header>

				<div class={style.postsGrid}>
					{posts.map((post) => (
						<article key={post.slug} class={style.postCard}>
							{post.cover && (
								<div class={style.postImage}>
									<img src={post.cover} alt={post.title} />
								</div>
							)}
							<div class={style.postContent}>
								<div class={style.postMeta}>
									<time dateTime={post.date}>
										{new Date(post.date).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}
									</time>
									{post.tags && (
										<span class={style.tags}>
											{post.tags.split(',').map(tag => (
												<span key={tag.trim()} class={style.tag}>
													{tag.trim()}
												</span>
											))}
										</span>
									)}
								</div>
								<h2 class={style.postTitle}>
									<Link href={`/blog/${post.slug}`}>{post.title}</Link>
								</h2>
								{post.subtitle && (
									<p class={style.postSubtitle}>{post.subtitle}</p>
								)}
								<p class={style.postExcerpt}>{post.excerpt}</p>
								<Link href={`/blog/${post.slug}`} class={style.readMore}>
									Read More →
								</Link>
							</div>
						</article>
					))}
				</div>

				{posts.length === 0 && (
					<div class={style.noPosts}>
						<p>No blog posts found.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Blogs;