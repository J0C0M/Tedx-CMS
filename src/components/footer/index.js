import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

const Footer = () => (
	<footer class={style.footer}>
		<div class={style.container}>
			<div class={style.footerContent}>
				{/* Logo and Description */}
				<div class={style.footerSection}>
					<Link href="/" class={style.logo}>
						<span class={style.tedx}>TEDx</span>
						<span class={style.roc}>ROC Nijmegen</span>
					</Link>
					<p class={style.footerDescription}>
                        Innovation in Action - Where creativity meets technology to forge a better future.
					</p>
				</div>

				{/* Quick Links */}
				<div class={style.footerSection}>
					<h3 class={style.footerTitle}>Quick Links</h3>
					<nav class={style.footerNav}>
						<Link href="/" class={style.footerLink}>Home</Link>
						<Link href="/speakers" class={style.footerLink}>Speakers</Link>
						<Link href="/blogs" class={style.footerLink}>Blog</Link>
					</nav>
				</div>

				{/* Event Info */}
				<div class={style.footerSection}>
					<h3 class={style.footerTitle}>Event Information</h3>
					<div class={style.eventInfo}>
						<p class={style.footerLink}>
							<strong>Location:</strong><br />
                            Heyendaalseweg 98<br />
                            6525 EE Nijmegen<br />
                            Netherlands
						</p>
						<p class={style.footerLink}>
							<strong>Contact:</strong><br />
							<a href="mailto:d.radic@roc-nijmegen.nl">d.radic@roc-nijmegen.nl</a>						</p>
					</div>
				</div>

				{/* Partners */}
				<div class={style.footerSection}>
					<h3 class={style.footerTitle}>Partners</h3>
					<div class={style.partners}>
						<a href="https://roboracer.ai/" target="_blank" rel="noopener noreferrer" class={style.partnerLink}>
                            ROBORACER
						</a>
						<a href="https://www.roc-nijmegen.nl/" target="_blank" rel="noopener noreferrer" class={style.partnerLink}>
                            ROC Nijmegen
						</a>
					</div>
				</div>
			</div>

			{/* Copyright */}
			<div class={style.footerBottom}>
				<div class={style.copyright}>
					<p>&copy; 2025 TEDx ROC Nijmegen. All rights reserved.</p>
					<p class={style.tedNotice}>
                        This independent TEDx event is operated under license from TED.
					</p>
				</div>
				<div class={style.footerBottomLinks}>
					<Link href="/privacy" class={style.footerBottomLink}>Privacy Policy</Link>
					<Link href="/terms" class={style.footerBottomLink}>Terms of Service</Link>
				</div>
			</div>
		</div>
	</footer>
);

export default Footer;