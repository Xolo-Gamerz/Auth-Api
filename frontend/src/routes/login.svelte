<script>
	const handleFormSubmit = () => {};
</script>

<div class="container">
	<form on:submit|preventDefault={handleFormSubmit}>
		<label for="email"> <b>Email</b></label>
		<input type="text" placeholder="youremail@email.com" name="email" required />
	</form>
</div>

<style>
	* {
		color: white;
	}
</style>
