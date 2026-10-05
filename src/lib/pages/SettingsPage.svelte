<script>
  import { api } from '../../api/client.js';
  import PageHeader from '../components/PageHeader.svelte';
  import StatusBlock from '../components/StatusBlock.svelte';

  let budget = $state(10000);
  let revenue = $state(41000);
  let fixedExpenses = $state([]);
  let loading = $state(true);
  let error = $state('');
  let saved = $state('');

  async function load() {
    loading = true; error = '';
    try {
      const data = await api.getSettings();
      budget = data.budget;
      revenue = data.revenue;
      fixedExpenses = data.fixedExpenses || [];
    } catch (err) { error = err.message; }
    finally { loading = false; }
  }

  function addExpense() { fixedExpenses = [...fixedExpenses, { name: '', amount: 0 }]; }
  function removeExpense(index) { fixedExpenses = fixedExpenses.filter((_, i) => i !== index); }
  async function save() {
    saved = ''; error = '';
    try {
      await api.saveSettings({ budget: Number(budget), revenue: Number(revenue), fixedExpenses: fixedExpenses.map(item => ({ name: item.name, amount: Number(item.amount) })).filter(item => item.name) });
      saved = 'Settings saved.';
      await load();
    } catch (err) { error = err.message; }
  }

  $effect(() => { load(); });
</script>

<PageHeader title="Settings" subtitle="Persisted budget, revenue, and fixed expenses">
  <button class="btn" onclick={save}>Save</button>
</PageHeader>

{#if loading}
  <StatusBlock message="Loading settings..." />
{:else}
  {#if error}<StatusBlock type="error" message={error} />{/if}
  {#if saved}<StatusBlock type="success" message={saved} />{/if}

  <section class="settings-grid">
    <div class="panel section-panel">
      <h2>Budget + Revenue</h2>
      <label>Biweekly budget<input class="field" type="number" min="0" step="0.01" bind:value={budget} /></label>
      <label>Revenue baseline<input class="field" type="number" min="0" step="0.01" bind:value={revenue} /></label>
    </div>

    <div class="panel section-panel">
      <div class="split-head"><h2>Fixed Expenses</h2><button class="btn secondary" onclick={addExpense}>Add</button></div>
      <div class="expense-list">
        {#each fixedExpenses as item, index}
          <div class="expense-row">
            <input class="field" bind:value={item.name} placeholder="Name" aria-label="Expense name" />
            <input class="field" type="number" min="0" step="0.01" bind:value={item.amount} placeholder="Amount" aria-label="Expense amount" />
            <button class="btn danger" onclick={() => removeExpense(index)}>Remove</button>
          </div>
        {/each}
      </div>
    </div>
  </section>
{/if}
