<script>
  import { api } from '../../api/client.js';
  import { getBiweeklyPeriod } from '../../utils/periods.js';
  import { formatPHP } from '../../utils/money.js';
  import PageHeader from '../components/PageHeader.svelte';
  import StatusBlock from '../components/StatusBlock.svelte';
  import MoneyCard from '../components/MoneyCard.svelte';
  import CategoryBreakdown from '../components/CategoryBreakdown.svelte';

  let period = getBiweeklyPeriod();
  let data = $state(null);
  let loading = $state(true);
  let error = $state('');

  async function load() {
    try { data = await api.getProjection(period); }
    catch (err) { error = err.message; }
    finally { loading = false; }
  }
  $effect(() => { load(); });
</script>

<PageHeader title="Projection" subtitle={`${period.start} → ${period.end}`} />

{#if loading}
  <StatusBlock message="Loading projection..." />
{:else if error}
  <StatusBlock type="error" message={error} />
{:else if data}
  <section class="summary-grid">
    <MoneyCard label="Revenue" value={data.revenue} />
    <MoneyCard label="Variable" value={data.variableExpensesTotal} />
    <MoneyCard label="Projected Left" value={data.projectedRemaining} />
  </section>
  <section class="two-col">
    <div class="panel section-panel"><h2>Fixed Expenses</h2>{#each data.fixedExpenses as item}<p class="line-item"><span>{item.name}</span><strong>{formatPHP(item.amount)}</strong></p>{/each}<hr /><p class="line-item"><span>Total</span><strong>{formatPHP(data.fixedExpensesTotal)}</strong></p></div>
    <div class="panel section-panel"><h2>Category Breakdown</h2><CategoryBreakdown rows={data.categoryBreakdown || []} /></div>
  </section>
{/if}
