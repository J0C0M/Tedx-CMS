// import { h } from 'preact';
// import { useState, useEffect } from 'preact/hooks';
// import { Link } from 'preact-router';
// import Markdown from 'markdown-to-jsx';
// import parseMd from 'parse-md';
// import style from './style.css';
//
// const Blog = ({ name }) => {
// 	const [post, setPost] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);
//
// 	useEffect(() => {
// 		loadBlogPost();
// 	}, [name]);
//
// 	const loadBlogPost = async () => {
// 		try {
// 			setLoading(true);
// 			const response = await fetch(`/content/blog/${name}.md`);
//
// 			if (!response.ok) {
// 				throw new Error('Post not found');
// 			}
//
// 			const text = await response.text();
// 			const { metadata, content } = parseMd(text);
//
// 			setPost({
// 				slug: name,
// 				...metadata,
// 				content
// 			});
// 		} catch (err) {
// 			setError(err.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};
//
// 	if (loading) {
// 		return (
// 			<div class={style.container}>
// 				<div class={style.loading}>Loading post...</div>
// 			</div>
// 		);
// 	}
//
// 	if (error) {
// 		return (
// 			<div class={style.container}>
// 				<div class={style.error}>
// 					<h1>Post Not Found</h1>
// 					<p>The blog post you're looking for doesn't exist.</p>
// 					<Link href="/blogs" class={style.backLink}>← Back to Blog</Link>
// 				</div>
// 			</div>
// 		);
// 	}
//
// 	return (
// 		<div class={style.blog}>
// 			<div class={style.container}>
// 				<nav class={style.breadcrumb}>
// 					<Link href="/blogs">← Back to Blog</Link>
// 				</nav>
//
// 				<article class={style.post}>
// 					<header class={style.postHeader}>
// 						{post.cover && (
// 							<div class={style.postCover}>
// 								<img src={post.cover} alt={post.title} />
// 							</div>
// 						)}
//
// 						<div class={style.postMeta}>
// 							<time dateTime={post.date} class={style.postDate}>
// 								{new Date(post.date).toLocaleDateString('en-US', {
// 									year: 'numeric',
// 									month: 'long',
// 									day: 'numeric'
// 								})}
// 							</time>
// 							{post.tags && (
// 								<div class={style.postTags}>
// 									{post.tags.split(',').map(tag => (
// 										<span key={tag.trim()} class={style.tag}>
// 											{tag.trim()}
// 										</span>
// 									))}
// 								</div>
// 							)}
// 						</div>
//
// 						<h1 class={style.postTitle}>{post.title}</h1>
// 						{post.subtitle && (
// 							<p class={style.postSubtitle}>{post.subtitle}</p>
// 						)}
// 					</header>
//
// 					<div class={style.postContent}>
// 						<Markdown>{post.content}</Markdown>
// 					</div>
// 				</article>
//
// 				<nav class={style.postNavigation}>
// 					<Link href="/blogs" class={style.backToList}>
// 						← All Posts
// 					</Link>
// 				</nav>
// 			</div>
// 		</div>
// 	);
// };
//
// export default Blog;