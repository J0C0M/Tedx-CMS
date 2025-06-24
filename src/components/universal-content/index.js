import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router';
import parseMd from 'parse-md';
import style from './style.css';

// Universal content component that can handle blogs, speakers, and events
const UniversalContent = ({ contentType = 'blog' }) => {
	const [allPosts, setAllPosts] = useState([]);
	const [filteredPosts, setFilteredPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		loadContent();
	}, [contentType]);

	useEffect(() => {
		filterPosts();
	}, [allPosts, contentType]);

	const loadContent = async () => {
		try {
			setLoading(true);
			setError(null);

			// Method 1: Using require.context (webpack specific)
			try {
				const context = require.context('../../../content/blog', false, /\.md$/);
				const loadedPosts = [];

				for (const key of context.keys()) {
					try {
						const fileContent = context(key).default || context(key);
						const markdownContent = typeof fileContent === 'string'
							? fileContent
							: fileContent.default || fileContent;

						const { metadata, content } = parseMd(markdownContent);

						loadedPosts.push({
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

				setAllPosts(loadedPosts);
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

			setAllPosts(posts);
		}
		catch (error) {
			console.error('Manual loading failed:', error);
			setError(`Failed to load ${contentType} content manually`);
		}
	};

	const filterContentByType = (posts, type) => posts.filter(post => {
		if (!post.tags) return type === 'blog'; // Default to blog if no tags

		const tags = typeof post.tags === 'string'
			? post.tags.split(',').map(t => t.trim().toLowerCase())
			: post.tags.map(t => t.toLowerCase());

		if (type === 'blog') {
			// Include posts that don't have 'speaker' or 'event' tag or explicitly have 'blog' tag
			return (!tags.includes('speaker') && !tags.includes('event')) || tags.includes('blog');
		}
		else if (type === 'speaker') {
			// Include posts that have 'speaker' tag
			return tags.includes('speaker');
		}
		else if (type === 'event') {
			// Include posts that have 'event' tag
			return tags.includes('event');
		}

		return true;
	});

	const filterPosts = () => {
		// Filter by content type only
		let posts = filterContentByType(allPosts, contentType);

		// Sort posts by date
		posts.sort((a, b) => {
			const dateA = new Date(a.date || 0);
			const dateB = new Date(b.date || 0);

			if (contentType === 'event') {
				// For events, sort by event date (upcoming first)
				const eventDateA = new Date(a.event_date || a.date || 0);
				const eventDateB = new Date(b.event_date || b.date || 0);
				return eventDateA - eventDateB;
			}

			return dateB - dateA; // Newest first for blogs and speakers
		});

		setFilteredPosts(posts);
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
					{/* eslint-disable-next-line react/jsx-no-bind */}
					<button onClick={loadContent}>Retry</button>
				</div>
			</div>
		);
	}

	const getPageTitle = () => {
		switch (contentType) {
			case 'blog': return 'Blog Posts';
			case 'speaker': return 'Our Speakers';
			case 'event': return 'Events';
			default: return 'Content';
		}
	};

	const getPageDescription = () => {
		switch (contentType) {
			case 'blog': return 'Latest updates and insights';
			case 'speaker': return 'Meet the innovative minds sharing their stories at TEDx ROC Nijmegen';
			case 'event': return 'Upcoming events and past gatherings';
			default: return '';
		}
	};

	const getGridClass = () => {
		switch (contentType) {
			case 'blog': return style.postsGrid;
			case 'speaker': return style.speakersGrid;
			case 'event': return style.eventsGrid;
			default: return style.postsGrid;
		}
	};

	const getPageClass = () => {
		switch (contentType) {
			case 'blog': return style.blogs;
			case 'speaker': return style.speakersPage;
			case 'event': return style.eventsPage;
			default: return style.blogs;
		}
	};

	const renderCard = (post) => {
		switch (contentType) {
			case 'blog': return <BlogCard key={post.slug} post={post} />;
			case 'speaker': return <SpeakerCard key={post.slug} speaker={post} />;
			case 'event': return <EventCard key={post.slug} event={post} />;
			default: return <BlogCard key={post.slug} post={post} />;
		}
	};

	return (
		<div class={getPageClass()}>
			<div class={style.container}>
				<header class={style.header}>
					<h1>{getPageTitle()}</h1>
					<p>{getPageDescription()}</p>
				</header>

				<div class={getGridClass()}>
					{filteredPosts.map(renderCard)}
				</div>

				{filteredPosts.length === 0 && !loading && (
					<div class={style.noPosts}>
						<p>No {contentType}s found.</p>
						<p>Make sure your markdown files have the correct tags in the metadata.</p>
					</div>
				)}
			</div>
		</div>
	);
};

// Blog card component (unchanged)
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
							.filter(tag => {
								const tagLower = tag.trim().toLowerCase();
								return tagLower !== 'speaker' && tagLower !== 'event';
							})
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

// Speaker card component (unchanged)
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

// Event card component with NEW styling
const EventCard = ({ event }) => {
	const eventDate = new Date(event.event_date || event.date);
	const isUpcoming = eventDate > new Date();
	const isPast = eventDate < new Date();

	return (
		<article class={`${style.eventCard} ${isUpcoming ? style.upcomingEvent : ''} ${isPast ? style.pastEvent : ''}`}>
			<div class={style.eventHeader}>
				<div class={style.eventDate}>
					{event.event_date && (
						<time dateTime={event.event_date} class={style.eventDateTime}>
							<span class={style.eventDay}>
								{new Date(event.event_date).getDate()}
							</span>
							<span class={style.eventMonth}>
								{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
							</span>
							<span class={style.eventYear}>
								{new Date(event.event_date).getFullYear()}
							</span>
						</time>
					)}
				</div>
				<div class={style.eventStatus}>
					{isUpcoming && <span class={style.statusBadge}>Upcoming</span>}
					{isPast && <span class={style.statusBadge}>Past Event</span>}
				</div>
			</div>

			{event.cover && (
				<div class={style.eventImage}>
					<img src={event.cover} alt={event.title} loading="lazy" />
				</div>
			)}

			<div class={style.eventContent}>
				<h2 class={style.eventTitle}>
					<Link href={`/events/${event.slug}`}>{event.title}</Link>
				</h2>

				{event.subtitle && (
					<p class={style.eventSubtitle}>{event.subtitle}</p>
				)}

				<p class={style.eventExcerpt}>{event.excerpt}</p>

				{event.tags && (
					<div class={style.eventTags}>
						{(typeof event.tags === 'string' ? event.tags.split(',') : event.tags)
							.filter(tag => tag.trim().toLowerCase() !== 'event')
							.map(tag => (
								<span key={tag.trim()} class={style.eventTag}>
									{tag.trim()}
								</span>
							))}
					</div>
				)}

				<div class={style.eventFooter}>
					<Link href={`/events/${event.slug}`} class={style.eventLink}>
						Learn More
					</Link>
				</div>
			</div>
		</article>
	);
};

export default UniversalContent;