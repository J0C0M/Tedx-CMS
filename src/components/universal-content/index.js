import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router';
import parseMd from 'parse-md';
import style from './style.css';

// Universal content component that can handle both blogs and speakers
const UniversalContent = ({ contentType = 'blog' }) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		loadContent();
	}, [contentType]);

	const loadContent = async () => {
		try {
			setLoading(true);
			setError(null);

			// Method 1: Using require.context (webpack specific)
			try {
				const context = require.context('../../../content/blog', false, /\.md$/);
				const allPosts = [];

				for (const key of context.keys()) {
					try {
						const fileContent = context(key).default || context(key);
						const markdownContent = typeof fileContent === 'string'
							? fileContent
							: fileContent.default || fileContent;

						const { metadata, content } = parseMd(markdownContent);

						allPosts.push({
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

				// Filter content based on type using tags
				const filteredPosts = filterContentByType(allPosts, contentType);

				// Sort posts by date (newest first)
				filteredPosts.sort((a, b) => {
					const dateA = new Date(a.date || 0);
					const dateB = new Date(b.date || 0);
					return dateB - dateA;
				});

				setPosts(filteredPosts);
			}
			catch (contextError) {
				console.error('require.context failed:', contextError);
				await loadContentManually();
			}
		}
		catch (error) {
			console.error('Error loading content:', error);
			setError(`Failed to load ${contentType} content`);
		}
		finally {
			setLoading(false);
		}
	};

	const filterContentByType = (posts, type) => posts.filter(post => {
		if (!post.tags) return type === 'blog'; // Default to blog if no tags

		const tags = typeof post.tags === 'string'
			? post.tags.split(',').map(t => t.trim().toLowerCase())
			: post.tags.map(t => t.toLowerCase());

		if (type === 'blog') {
			// Include posts that don't have 'speaker' tag or explicitly have 'blog' tag
			return !tags.includes('speaker') || tags.includes('blog');
		}
		else if (type === 'speaker') {
			// Include posts that have 'speaker' tag
			return tags.includes('speaker');
		}

		return true;
	});

	const loadContentManually = async () => {
		try {
			const posts = [];
			// Add your manual imports here
			const helloTitleMd = await import('../../../content/blog/hello-title.md');
			const fileContent = helloTitleMd.default || helloTitleMd;
			const { metadata, content } = parseMd(fileContent);

			posts.push({
				slug: 'hello-title',
				...metadata,
				content,
				excerpt: content.substring(0, 200) + (content.length > 200 ? '...' : '')
			});

			const filteredPosts = filterContentByType(posts, contentType);
			setPosts(filteredPosts);
		}
		catch (error) {
			console.error('Manual loading failed:', error);
			setError(`Failed to load ${contentType} content manually`);
		}
	};

	if (loading) {
		return (
			<div class={style.container}>
				<div class={style.loading}>Loading {contentType}s...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div class={style.container}>
				<div class={style.error}>
					<p>{error}</p>
					<button onClick={loadContent}>Retry</button>
				</div>
			</div>
		);
	}

	return (
		<div class={contentType === 'blog' ? style.blogs : style.speakersPage}>
			<div class={style.container}>
				<header class={style.header}>
					<h1>{contentType === 'blog' ? 'Blog Posts' : 'Our Speakers'}</h1>
					<p>
						{contentType === 'blog'
							? 'Latest updates and insights'
							: 'Meet the innovative minds sharing their stories at TEDx ROC Nijmegen'
						}
					</p>
				</header>

				<div class={contentType === 'blog' ? style.postsGrid : style.speakersGrid}>
					{posts.map((post) => (
						contentType === 'blog'
							? <BlogCard key={post.slug} post={post} />
							: <SpeakerCard key={post.slug} speaker={post} />
					))}
				</div>

				{posts.length === 0 && (
					<div class={style.noPosts}>
						<p>No {contentType}s found.</p>
						<p>Make sure your markdown files have the correct tags in the metadata.</p>
					</div>
				)}
			</div>
		</div>
	);
};

// Blog card component
const BlogCard = ({ post }) => (
	<article class={style.postCard}>
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
							.filter(tag => tag.trim().toLowerCase() !== 'speaker') // Hide speaker tag in blog view
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
);

// Speaker card component
const SpeakerCard = ({ speaker }) => (
	<div class={style.speakerCard}>
		<div class={style.speakerImage}>
			<img src={speaker.cover || speaker.image} alt={speaker.title} />
		</div>
		<div class={style.speakerContent}>
			<h3 class={style.speakerName}>{speaker.title}</h3>
			<p class={style.speakerTitle}>{speaker.subtitle}</p>
			{speaker.company && (
				<p class={style.speakerCompany}>{speaker.company}</p>
			)}

			{speaker.talk_title && (
				<div class={style.talkInfo}>
					<h4 class={style.talkTitle}>{speaker.talk_title}</h4>
					{speaker.talk_description && (
						<p class={style.talkDescription}>{speaker.talk_description}</p>
					)}
				</div>
			)}

			<p class={style.speakerBio}>{speaker.excerpt}</p>

			{(speaker.linkedin || speaker.twitter || speaker.website) && (
				<div class={style.speakerSocial}>
					{speaker.linkedin && (
						<a href={speaker.linkedin} target="_blank" rel="noopener noreferrer" class={style.socialLink}>
                            LinkedIn
						</a>
					)}
					{speaker.twitter && (
						<a href={speaker.twitter} target="_blank" rel="noopener noreferrer" class={style.socialLink}>
                            Twitter
						</a>
					)}
					{speaker.website && (
						<a href={speaker.website} target="_blank" rel="noopener noreferrer" class={style.socialLink}>
                            Website
						</a>
					)}
				</div>
			)}
		</div>
	</div>
);

export default UniversalContent;
