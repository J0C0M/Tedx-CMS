import { h } from 'preact';
import { Link } from 'preact-router';
import style from './style.css';
import { useEffect } from 'preact-hooks';

const Home = () => {

	/**
	 * Netlify CMS's accept invite link land on home page.
	 * This redirection takes it to the right place(/admin).
	 */
	useEffect(() => {
		if (window !== undefined && window.location.href.includes('#invite_token')) {
			const { href } = window.location;
			window.location.href= `${href.substring(0, href.indexOf('#'))}admin${href.substring(href.indexOf('#'))}`;
		}
	},[]);

	return (
		<div class={style.home}>
			{/* Hero Section */}
			<section class={style.hero}>
				<div class={style.heroContent}>
					<div class={style.heroText}>
						<h1 class={style.heroTitle}>
							<span class={style.tedx}>TEDx</span>
							<span class={style.roc}>ROC Nijmegen</span>
						</h1>
						<h2 class={style.heroSubtitle}>Innovation in Action</h2>
						<p class={style.heroDescription}>
							This is an event where we have put two events together to make one big event!
							We kick off the week with the exciting competition of ROBORACER where teams will compete
							against each other to see who has the best car and algorithm!
						</p>
						<div class={style.heroButtons}>
							<Link href="/https://www.eventbrite.com/e/tickets-tedx-roc-nijmegen-1204808858729?aff=oddtdtcreator" class={style.btnPrimary}>Get Your Tickets</Link>
							<Link href="/speakers" class={style.btnSecondary}>View Speakers</Link>
						</div>
					</div>
					<div class={style.heroImage}>
						<div class={style.tedxLogo}>
							<img src="/assets/tedx-logo.png" alt="TEDx Logo" />
						</div>
					</div>
				</div>
			</section>

			{/* Event Info Section */}
			<section class={style.eventInfo}>
				<div class={style.container}>
					<div class={style.eventDetails}>
						<div class={style.eventCard}>
							<h3>📅 Date & Time</h3>
							<p>Coming Soon</p>
						</div>
						<div class={style.eventCard}>
							<h3>📍 Location</h3>
							<p>Heyendaalseweg 98<br />6525 EE Nijmegen<br />Netherlands</p>
						</div>
						<div class={style.eventCard}>
							<h3>🎯 Theme</h3>
							<p>Innovation in Action</p>
						</div>
					</div>
				</div>
			</section>

			{/* About Section */}
			<section class={style.about}>
				<div class={style.container}>
					<div class={style.aboutContent}>
						<div class={style.aboutText}>
							<h2>About TEDx ROC Nijmegen</h2>
							<p>
								At TEDx ROC Nijmegen, we delve into the forefront of innovation, where creativity
								meets technology to forge a better future. Our theme, "Innovation in Action,"
								celebrates the passion and determination to turn ideas into reality—whether through
								software development, 3D printing, groundbreaking engineering, or pioneering new
								energy sources like HHO (Hydrogen-Hydrogen-Oxygen).
							</p>
							<p>
								This event highlights the inspiring stories of students, educators, and professionals
								who are pushing the boundaries of what's possible in technical fields. From designing
								sustainable solutions and developing innovative software to creating cutting-edge
								hardware and exploring renewable energy, our speakers share their journeys of
								transforming bold ideas into impactful realities.
							</p>
						</div>
						<div class={style.aboutImage}>
							<img src="/assets/innovation-image.jpg" alt="Innovation in Action" />
						</div>
					</div>
				</div>
			</section>

			{/* ROBORACER Section */}
			<section class={style.roboracer}>
				<div class={style.container}>
					<div class={style.roboracerContent}>
						<div class={style.roboracerImage}>
							<img src="/assets/roboracer-logo.png" alt="ROBORACER" />
						</div>
						<div class={style.roboracerText}>
							<h2>ROBORACER Competition</h2>
							<p>
								We kick off the week with the exciting competition of ROBORACER where teams will
								compete against each other to see who has the best car and algorithm! After this
								great racing spectacle we will continue with TEDx, where various speakers will
								talk about their field of expertise and their studies.
							</p>
							<p>
								Today we will set up the track. You are welcome to come and have a look or to
								set up your racing gear on location.
							</p>
							<a href="https://roboracer.ai/" target="_blank" rel="noopener noreferrer" class={style.btnSecondary}>
								Learn More About ROBORACER
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Transportation Section */}
			<section class={style.transportation}>
				<div class={style.container}>
					<h2>Getting There</h2>
					<div class={style.transportGrid}>
						<div class={style.transportCard}>
							<h3>🚌 Public Transport</h3>
							<p>In the area there are many possibilities with public transport. The location is next to a large bus and train station.</p>
						</div>
						<div class={style.transportCard}>
							<h3>🚗 Parking</h3>
							<p>There are many areas in the area where parking is free and the parking garage will be open on race/TEDx day.</p>
						</div>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section class={style.cta}>
				<div class={style.container}>
					<h2>Interested? Be sure to come!</h2>
					<p>Join us for this exciting combination of innovation, technology, and inspiration.</p>
					<div class={style.ctaButtons}>
						<Link href="/register" class={style.btnPrimary}>Register for Event</Link>
						<Link href="/contact" class={style.btnSecondary}>Contact Us</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;