<script>
  import { formatPHP } from '../../utils/money.js';
  let { rows = [] } = $props();
</script>

{#if !rows.length}
  <div class="status">No category spending for this period.</div>
{:else}
  <details class="breakdown">
    <summary>Show category breakdown ({rows.length})</summary>
    <div class="breakdown-list">
      {#each rows as row}
        <div class="breakdown-row">
          <span>{row.category}</span>
          <strong>{formatPHP(row.total)}</strong>
          <em>{row.count} tx</em>
        </div>
      {/each}
    </div>
  </details>
{/if}
