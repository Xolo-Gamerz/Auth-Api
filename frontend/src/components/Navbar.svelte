<script lang="ts">
import { goto } from '$app/navigation';

	import type NavbarLi from 'src/interfaces/NavbarLi';
	import Icon from '../assets/Icon.svg';
	const ListItems: Array<NavbarLi> = [
		{
			name: 'Notes',
			url: '/notes',
			id: Math.random() * 1000 + 100
		},
		{
			name: 'About',
			url: '/about',
			id: Math.random() * 1000 + 100
		},
		{
			name: 'Home',
			url: '/',
			id: Math.random() * 1000 + 100
		},
		{
			name: 'Contact',
			url: '/contact',
			id: Math.random() * 1000 + 100
		},
		{
			name: 'Tunes',
			url: '/tunes',
			id: Math.random() * 1000 + 100
		}
	];
	const handleClick = () =>{
		goto("/login")
	}
</script>

<nav class="container">
	<div class="icon">
		<img src={Icon} alt="Icon" />
	</div>
	<ul>
		{#each ListItems as { name, url }, id}
			<li>
				<a href={url}> {name} </a>
			</li>
		{/each}
	</ul>
	<div class="login-btn">
		<button type="button" on:click={handleClick}>Login</button>
	</div>
</nav>

<style>
	* {
		text-decoration: none;
		list-style-type: none;
	}
	.container {
		display: flex;
		justify-content: space-between;
		background: rgb(25, 33, 44);
		padding: 0.4rem;
	}
	.icon {
		display: inherit;
		height: 3.5rem;
		padding: 0.28rem 0.7rem;
	}
	ul {
		display: inherit;
		align-items: center;
		padding: 0 2rem;
	}
	ul li a {
		color: white;
		padding: 0.55rem 0.9rem;
		font-size: 1.1rem;
		font-family: cursive;
		font-weight: 900;
	}
	ul li a:hover {
		color: black !important;
		background: rgb(89, 0, 16);
		border-radius: 5.2rem;
	}
	.login-btn {
		display: inherit;
		padding: 0.8rem;
		align-items: center;
		justify-content: center;
	}
	.login-btn button {
		height: 2.39rem;
		width: 4.4rem;
		font-size: 0.96em;
		font-weight: 900;
		align-items: center;
		justify-content: center;
		display: flex;
		background: rgb(17, 86, 154);
		border: none;
		color: white;
		border-radius: 0.8rem;
		cursor: pointer;
	}
	.login-btn button:hover {
		background: #bf1b9c !important;
		color: black !important;
	}
	.login-btn button:active {
		transform: translateY(4px);
		box-shadow: 2px 1px 0 2px #666;
	}
</style>
