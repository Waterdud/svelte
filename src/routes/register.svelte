<script>
	import { goto, stores } from '@sapper/app';
	import ListErrors from '../_components/ListErrors.svelte';
	import { post } from '../node_modules/api.js';

	const { session } = stores();

	let username = '';
	let name = '';
	let password = '';
	let errors = null;

	async function submit(event) {
		try {
			const response = await post('users', { username, name, password });

			errors = null;

			if (response && response.id) {
				goto('/');
			} else if (response && response.errors) {
				errors = response.errors;
			} else if (response && response.error) {
				errors = { general: [response.error] };
			} else if (response && response.message) {
				errors = { general: [response.message] };
			} else {
				errors = { general: ['Registration failed. Please try again.'] };
			}
		} catch (error) {
			console.error('Registration error:', error);
			errors = { general: ['Network error. Please check your connection and try again.'] };
		}
	}
</script>

<svelte:head>
	<title>Sign up • Barbank</title>
</svelte:head>

<div class="auth-page">
	<div class="container page">
		<div class="row">
			<div class="col-md-6 offset-md-3 col-xs-12">
				<h1 class="text-xs-center">Sign up</h1>
				<p class="text-xs-center">
					<a href="/login">Have an account?</a>
				</p>

				{#if errors}
					<div class="alert alert-danger" role="alert"><ListErrors {errors}/></div>
				{/if}

				<form on:submit|preventDefault={submit}>
					<fieldset class="form-group">
						<input class="form-control form-control-lg" type="text" required placeholder="Your username" 
							bind:value={username}>
					</fieldset>
					<fieldset class="form-group">
						<input class="form-control form-control-lg" type="text" required placeholder="name" 
							bind:value={name}>
					</fieldset>
					<fieldset class="form-group">
						<input class="form-control form-control-lg" type="password" required placeholder="Password" 
							bind:value={password}>
							{#if password.length > 1 && password.length < 6}<sub><div class="alert alert-danger">Password too short</div></sub>{/if}
					</fieldset>
					<button class="btn btn-lg btn-primary pull-xs-right" disabled={password.length < 6}>
						Sign up
					</button>
				</form>
			</div>
		</div>
	</div>
</div>