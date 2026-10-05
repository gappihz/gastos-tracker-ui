<script>
  import { formatPHP } from '../../utils/money.js';
  let { label, value = 0, note = '' } = $props();
</script>

<article class="panel money-card">
  <span>{label}</span>
  <strong>{formatPHP(value)}</strong>
  {#if note}<p>{note}</p>{/if}
</article>
