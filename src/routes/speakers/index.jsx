import { h } from 'preact';
import { usePrerenderData } from '@preact/prerender-data-provider';
import style from './style.css';

const Speakers = (props) => {
	const [data, isLoading] = usePrerenderData(props);

	return (
		<div class={style.speakersPage}>
			<div class={style.container}>
				<header class={style.pageHeader}>
					<h1 class={style.pageTitle}>Our Speakers</h1>
					<p class={style.pageSubtitle}>
						Meet the innovative minds sharing their stories at TEDx ROC Nijmegen
					</p>
				</header>

				{getSpeakersContent(data, isLoading)}
			</div>
		</div>
	);
};

function getSpeakersContent(data, isLoading) {
	if (isLoading) {
		return (
			<div class={style.loadingGrid}>
				{[...Array(6)].map((_, i) => (
					<div key={i} class={style.speakerCardLoading}>
						<div class={`${style.speakerImageLoading} loading`} />
						<div class={`${style.speakerNameLoading} loading`} />
						<div class={`${style.speakerTitleLoading} loading`} />
						<div class={`${style.speakerBioLoading} loading`} />
					</div>
				))}
			</div>
		);
	}

	if (data && data.data) {
		const { data: speakers } = data;
		const featuredSpeakers = speakers.edges.filter(speaker => speaker.featured);
		const regularSpeakers = speakers.edges.filter(speaker => !speaker.featured);

		return (
			<div>
				{featuredSpeakers.length > 0 && (
					<section class={style.featuredSection}>
						<h2 class={style.sectionTitle}>Featured Speakers</h2>
						<div class={style.featuredGrid}>
							{featuredSpeakers.map(speaker => (
								<SpeakerCard key={speaker.id} speaker={speaker} featured />
							))}
						</div>
					</section>
				)}

				{regularSpeakers.length > 0 && (
					<section class={style.speakersSection}>
						<h2 class={style.sectionTitle}>
							{featuredSpeakers.length > 0 ? 'All Speakers' : 'Speakers'}
						</h2>
						<div class={style.speakersGrid}>
							{regularSpeakers.map(speaker => (
								<SpeakerCard key={speaker.id} speaker={speaker} featured={false} />
							))}
						</div>
					</section>
				)}

				{(!data.data || data.data.edges.length === 0) && (
					<div class={style.noSpeakers}>
						<h2>Speakers Coming Soon!</h2>
						<p>We're working on confirming our amazing lineup of speakers. Check back soon!</p>
					</div>
				)}
			</div>
		);
	}
}

function SpeakerCard({ speaker, featured }) {
	return (
		<div class={`${style.speakerCard} ${featured ? style.featuredCard : ''}`}>
			<div class={style.speakerImage}>
				<img src={speaker.image} alt={speaker.name} />
			</div>
			<div class={style.speakerContent}>
				<h3 class={style.speakerName}>{speaker.name}</h3>
				<p class={style.speakerTitle}>{speaker.title}</p>
				{speaker.company && (
					<p class={style.speakerCompany}>{speaker.company}</p>
				)}

				<div class={style.talkInfo}>
					<h4 class={style.talkTitle}>{speaker.talk_title}</h4>
					<p class={style.talkDescription}>{speaker.talk_description}</p>
				</div>

				<p class={style.speakerBio}>{speaker.bio}</p>

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
}

export default Speakers;