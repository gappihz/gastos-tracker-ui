<script>
  let { treatment = $bindable('normal'), note = $bindable(''), onchange } = $props();
</script>

<div class="treatment-grid">
  <label>
    Treatment
    <select class="field" bind:value={treatment} onchange={onchange}>
      <option value="normal">Normal</option>
      <option value="big_purchase">Big Purchase</option>
      <option value="monthly">Monthly 50/50</option>
    </select>
  </label>
  <label>
    Note
    <input class="field" bind:value={note} onchange={onchange} placeholder="Optional note" />
  </label>
</div>
