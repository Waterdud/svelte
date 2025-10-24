<script>
	export let errors = null;
</script>

{#if errors}
		{#each Object.entries(errors) as [field, messages]}
			{#each messages as message}
				<p>{field} {message}</p>
			{/each}
		{/each}
{/if}
