import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router';
import parseMd from 'parse-md';
import style from './style.css';

const Blogs = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		loadBlogPosts();
	}, []);

	const loadBlogPosts = async () => {
		try {
			setLoading(true);
			setError(null);

			// Method 1: Using require.context (webpack specific)
			try {
				const context = require.context('../../../content/blog', false, /\.md$/);
				const posts = [];

				for (const key of context.keys()) {
					try {
						// Get the raw content - this might need adjustment based on your bundler
						const fileContent = context(key).default || context(key);

						// If fileContent is not a string, it might be a module
						const markdownContent = typeof fileContent === 'string'
							? fileContent
							: fileContent.default || fileContent;

						const { metadata, content } = parseMd(markdownContent);

						posts.push({
							slug: key.replace('./', '').replace('.md', ''),
							...metadata,
							content,
							excerpt: content.substring(0, 200) + (content.length > 200 ? '...' : '')
						});
					}
					catch (fileError) {
						console.warn(`Error processing file ${key}:`, fileError);
					}
				}

				// Sort posts by date (newest first)
				posts.sort((a, b) => {
					const dateA = new Date(a.date || 0);
					const dateB = new Date(b.date || 0);
					return dateB - dateA;
				});

				setPosts(posts);
			}
			catch (contextError) {
				console.error('require.context failed:', contextError);

				// Method 2: Fallback - manual import (you'll need to add imports for each file)
				await loadPostsManually();
			}
		}
		catch (error) {
			console.error('Error loading blog posts:', error);
			setError('Failed to load blog posts');
		}
		finally {
			setLoading(false);
		}
	};

	// Fallback method - you'll need to import each markdown file manually
	const loadPostsManually = async () => {
		try {
			const posts = [];

			// Import your markdown files manually
			// You'll need to add these imports at the top of the file or use dynamic imports
			const helloTitleMd = await import('../../../content/blog/hello-title.md');

			// Process the imported markdown
			const fileContent = helloTitleMd.default || helloTitleMd;
			const { metadata, content } = parseMd(fileContent);

			posts.push({
				slug: 'hello-title',
				...metadata,
				content,
				excerpt: content.substring(0, 200) + (content.length > 200 ? '...' : '')
			});

			// Add more files here as needed
			// const anotherPostMd = await import('../../../content/blog/another-post.md');
			// ... process similarly

			posts.sort((a, b) => {
				const dateA = new Date(a.date || 0);
				const dateB = new Date(b.date || 0);
				return dateB - dateA;
			});

			setPosts(posts);
		}
		catch (error) {
			console.error('Manual loading failed:', error);
			setError('Failed to load blog posts manually');
		}
	};

	if (loading) {
		return (
			<div class={style.container}>
				<div class={style.loading}>Loading posts...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div class={style.container}>
				<div class={style.error}>
					<p>{error}</p>
					{/* eslint-disable-next-line react/jsx-no-bind */}
					<button onClick={loadBlogPosts}>Retry</button>
				</div>
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
									<img src={post.cover} alt={post.title} loading="lazy" />
								</div>
							)}
							<div class={style.postContent}>
								<div class={style.postMeta}>
									{post.date && (
										<time dateTime={post.date}>
											{new Date(post.date).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}
										</time>
									)}
									{post.tags && (
										<span class={style.tags}>
											{(typeof post.tags === 'string' ? post.tags.split(',') : post.tags)
												.map(tag => (
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
							</div>
						</article>
					))}
				</div>

				{posts.length === 0 && (
					<div class={style.noPosts}>
						<p>No blog posts found.</p>
						<p>Make sure your markdown files are in the correct directory: content/blog/</p>
					</div>
				)}

			</div>
		</div>
	);
};

export default Blogs;