import { h } from 'preact';
import { usePrerenderData } from '@preact/prerender-data-provider';
import style from './style';

const Speakers = (props) => {
	const [data, isLoading] = usePrerenderData(props);
    
	return (
		<div class={style.speakersPage}>
			<div class={style.hero}>
				<div class={style.heroContent}>
					<h1 class={style.heroTitle}>Our Speakers</h1>
					<p class={style.heroSubtitle}>Meet the inspiring voices who will share their ideas worth spreading</p>
				</div>
			</div>

			<div class={style.container}>
				{getSpeakersListing(data, isLoading)}
			</div>
		</div>
	);
};

function getSpeakersListing(data, isLoading) {
	if (isLoading) {
		return (
			<div class={style.speakersGrid}>
				{[1,2,3,4,5,6].map(i => (
					<div key={i} class={style.speakerCard}>
						<div class={`${style.speakerPhoto} loading`} />
						<div class={style.speakerInfo}>
							<div class={`${style.speakerName} loading`} />
							<div class={`${style.speakerTitle} loading`} />
							<div class={`${style.speakerBio} loading`} />
						</div>
					</div>
				))}
			</div>
		);
	}

	// Mock data for demonstration - replace with actual data fetching
	const speakers = [
		{
			id: 1,
			name: 'Sarah Johnson',
			title: 'Innovation Director',
			company: 'Tech Forward',
			photo: '/assets/speaker1.jpg',
			bio: 'Sarah has been leading innovation in tech for over 15 years, focusing on sustainable technology solutions.',
			talk_title: 'The Future of Sustainable Tech',
			featured: true
		},
		{
			id: 2,
			name: 'Marcus Chen',
			title: 'Social Entrepreneur',
			company: 'Impact Ventures',
			photo: '/assets/speaker2.jpg',
			bio: 'Marcus founded three successful social enterprises focused on education and community development.',
			talk_title: 'Building Communities Through Innovation',
			featured: false
		},
		{
			id: 3,
			name: 'Dr. Elena Rodriguez',
			title: 'Climate Scientist',
			company: 'Climate Research Institute',
			photo: '/assets/speaker3.jpg',
			bio: 'Leading researcher in climate change adaptation and renewable energy solutions.',
			talk_title: 'Climate Action: From Science to Solutions',
			featured: true
		}
	];

	const featuredSpeakers = speakers.filter(speaker => speaker.featured);
	const regularSpeakers = speakers.filter(speaker => !speaker.featured);

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

			<section class={style.allSpeakersSection}>
				<h2 class={style.sectionTitle}>All Speakers</h2>
				<div class={style.speakersGrid}>
					{regularSpeakers.map(speaker => (
						<SpeakerCard key={speaker.id} speaker={speaker} featured={false} />
					))}
				</div>
			</section>
		</div>
	);
}

function SpeakerCard({ speaker, featured }) {
	return (
		<div class={`${style.speakerCard} ${featured ? style.featured : ''}`}>
			<div class={style.speakerPhoto} style={`background-image: url(${speaker.photo})`}>
				<div class={style.overlay}>
					<div class={style.talkTitle}>{speaker.talk_title}</div>
				</div>
			</div>
			<div class={style.speakerInfo}>
				<h3 class={style.speakerName}>{speaker.name}</h3>
				<p class={style.speakerTitle}>{speaker.title}</p>
				{speaker.company && <p class={style.speakerCompany}>{speaker.company}</p>}
				<p class={style.speakerBio}>{speaker.bio}</p>
			</div>
		</div>
	);
}

export default Speakers;