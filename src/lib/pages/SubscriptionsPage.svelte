<script>
  import { api } from '../../api/client.js';
  import { currentMonthInputValue, monthRange } from '../../utils/periods.js';
  import { formatPHP } from '../../utils/money.js';
  import PageHeader from '../components/PageHeader.svelte';
  import StatusBlock from '../components/StatusBlock.svelte';
  import SubscriptionCard from '../components/subscriptions/SubscriptionCard.svelte';

  let selectedMonth = $state(currentMonthInputValue());
  let subscriptions = $state([]);
  let period = $state(null);
  let loading = $state(true);
  let error = $state('');
  let manualVendor = $state('');
  let manualService = $state('');

  async function load() {
    loading = true; error = '';
    try {
      const [year, month] = selectedMonth.split('-').map(Number);
      const range = monthRange(year, month);
      const data = await api.getSubscriptions({ ...range, includeHistory: true });
      subscriptions = data.subscriptions || [];
      period = data.period || range;
    } catch (err) { error = err.message; }
    finally { loading = false; }
  }

  async function updateOverride(payload) { await api.updateSubscription(payload); await load(); }
  async function manualConfirm() {
    if (!manualVendor.trim() || !manualService.trim()) return;
    await updateOverride({ override_scope: 'vendor', normalized_vendor: manualVendor.trim().toUpperCase(), service_name: manualService.trim(), status: 'manual' });
    manualVendor = ''; manualService = '';
  }

  $effect(() => { selectedMonth; load(); });
</script>

<PageHeader title="Subscriptions" subtitle={period ? `${period.start} → ${period.end}` : 'Alias + override detection'}>
  <input class="field month-input" type="month" bind:value={selectedMonth} aria-label="Month" />
</PageHeader>

<section class="panel section-panel">
  <h2>Manual Vendor Override</h2>
  <div class="form-grid">
    <input class="field" bind:value={manualVendor} placeholder="Vendor text / normalized vendor" aria-label="Vendor text" />
    <input class="field" bind:value={manualService} placeholder="Service name" aria-label="Service name" />
    <button class="btn" onclick={manualConfirm}>Mark Subscription</button>
  </div>
</section>

{#if loading}
  <StatusBlock message="Loading subscriptions..." />
{:else if error}
  <StatusBlock type="error" message={error} />
{:else if !subscriptions.length}
  <StatusBlock message="No confirmed subscriptions for this month." />
{:else}
  <section class="sub-list">
    {#each subscriptions as sub}
      <SubscriptionCard {sub} onoverride={updateOverride} />
    {/each}
  </section>
{/if}
