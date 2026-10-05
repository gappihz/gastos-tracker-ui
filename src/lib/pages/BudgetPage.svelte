<script>
  import { api } from '../../api/client.js';
  import { getBiweeklyPeriod, shiftPeriod } from '../../utils/periods.js';
  import { formatPHP } from '../../utils/money.js';
  import PageHeader from '../components/PageHeader.svelte';
  import StatusBlock from '../components/StatusBlock.svelte';
  import MoneyCard from '../components/MoneyCard.svelte';
  import BudgetMeter from '../components/BudgetMeter.svelte';
  import CategoryBreakdown from '../components/CategoryBreakdown.svelte';
  import TransactionList from '../components/transactions/TransactionList.svelte';

  let period = $state(getBiweeklyPeriod());
  let summary = $state(null);
  let transactions = $state([]);
  let loading = $state(true);
  let error = $state('');
  let showInvalid = $state(false);
  const visibleTransactions = $derived(showInvalid ? transactions : transactions.filter(tx => tx.valid));
  const invalidCount = $derived(transactions.filter(tx => !tx.valid).length);

  async function load() {
    loading = true; error = '';
    try {
      const [summaryData, txData] = await Promise.all([api.getSummary(period), api.getTransactions(period)]);
      summary = summaryData;
      transactions = txData.transactions || [];
    } catch (err) { error = err.message; }
    finally { loading = false; }
  }

  function move(direction) { period = direction === 0 ? getBiweeklyPeriod() : shiftPeriod(period, direction); load(); }
  async function updateTreatment(payload) { await api.updateTransaction(payload); await load(); }

  $effect(() => { load(); });
</script>

<PageHeader title="Budget" subtitle={`${period.start} → ${period.end}`}>
  <div class="control-row">
    <button class="btn secondary" onclick={() => move(-1)}>Previous</button>
    <button class="btn secondary" onclick={() => move(0)}>Current</button>
    <button class="btn secondary" onclick={() => move(1)}>Next</button>
  </div>
</PageHeader>

{#if loading}
  <StatusBlock message="Loading budget..." />
{:else if error}
  <StatusBlock type="error" message={error} />
{:else if summary}
  <section class="summary-grid">
    <div class="panel budget-panel">
      <span>Remaining</span>
      <strong>{formatPHP(summary.remaining)}</strong>
      <BudgetMeter percentSpent={summary.percentSpent} />
      <p>Spent {formatPHP(summary.spent)} of {formatPHP(summary.budget)}</p>
    </div>
    <MoneyCard label="Normal" value={summary.treatmentTotals?.normal || 0} />
    <MoneyCard label="Monthly" value={summary.treatmentTotals?.monthly || 0} note="50/50 allocated" />
    <MoneyCard label="Big Purchases" value={summary.treatmentTotals?.big_purchase || 0} note="Excluded" />
  </section>

  <section class="panel section-panel">
    <h2>Category Breakdown</h2>
    <CategoryBreakdown rows={summary.categoryTotals || []} />
  </section>

  <section class="section-panel">
    <div class="split-head">
      <h2>Transactions</h2>
      <label class="toggle-label">
        <input type="checkbox" bind:checked={showInvalid} />
        Show invalid{invalidCount ? ` (${invalidCount})` : ''}
      </label>
    </div>
    <TransactionList transactions={visibleTransactions} onupdate={updateTreatment} />
  </section>
{/if}
