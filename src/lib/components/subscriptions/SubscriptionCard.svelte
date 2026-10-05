<script>
  import { formatPHP } from '../../../utils/money.js';
  let { sub, onoverride } = $props();
  let serviceName = $state('Subscription');

  $effect(() => {
    sub.service;
    serviceName = sub.service || 'Subscription';
  });

  function payload(status) {
    return { override_scope: 'vendor', normalized_vendor: sub.normalizedVendor, service_name: serviceName, status };
  }
</script>

<article class="sub-card">
  <div class="sub-head">
    <div>
      <strong>{sub.service}</strong>
      <p>{(sub.detectionMethods || []).join(' · ')}</p>
    </div>
    <span>{formatPHP(sub.monthlyExpensesPaid || 0)}</span>
  </div>

  <div class="stat-grid">
    <p><span>Latest</span><strong>{formatPHP(sub.latestAmount || 0)}</strong></p>
    <p><span>Average</span><strong>{formatPHP(sub.averageAmount || 0)}</strong></p>
    <p><span>Count</span><strong>{sub.count}</strong></p>
    <p><span>Last Paid</span><strong>{sub.lastPaidDate || '-'}</strong></p>
  </div>

  <div class="override-grid">
    <input class="field" bind:value={serviceName} placeholder="Service name" aria-label="Service name" />
    <button class="btn secondary" onclick={() => onoverride(payload('renamed'))}>Rename</button>
    <button class="btn secondary" onclick={() => onoverride(payload('confirmed'))}>Confirm</button>
    <button class="btn danger" onclick={() => onoverride({ override_scope: 'vendor', normalized_vendor: sub.normalizedVendor, status: 'ignored' })}>Ignore</button>
  </div>

  <details>
    <summary>History</summary>
    <div class="history-list">
      {#each sub.history || [] as row}
        <div class="history-row">
          <strong>{row.vendor}</strong>
          <span>{formatPHP(row.amount || 0)}</span>
          <em>{row.messagedate} · {row.category} · {row.budget_treatment || 'normal'}</em>
          {#if row.description}<p>{row.description}</p>{/if}
        </div>
      {/each}
    </div>
  </details>
</article>
