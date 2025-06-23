import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

const Header = () => (
	<header class={style.header}>
		<div class={style.container}>
			<Link href="/" class={style.logo}>
				<span class={style.tedx}>TEDx</span>
				<span class={style.roc}>ROC Nijmegen</span>
			</Link>
			<nav class={style.nav}>
				<Link activeClassName={style.active} href="/">Home</Link>
				<Link activeClassName={style.active} href="#speakers">Speakers</Link>
				<Link activeClassName={style.active} href="#blogs">Blog</Link>
				<Link activeClassName={style.active} href="/blogs">Blog</Link>
			</nav>
		</div>
	</header>
);

export default Header;