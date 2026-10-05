<script>
  let { percentSpent = 0 } = $props();
  const remaining = $derived(Math.max(0, 100 - Number(percentSpent || 0)));
</script>

<div class="meter" aria-label="Budget remaining">
  <div class="meter-fill" style={`width:${remaining}%`}></div>
</div>
